import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {users, videos, videoUpdateSchema, videoViews} from "@/db/schema";
import {db} from "@/db";
import {mux} from "@/lib/mux";
import {and, eq, getTableColumns} from "drizzle-orm";
import {TRPCError} from "@trpc/server";
import {z} from "zod";
import {UTApi} from "uploadthing/server";

export const videosRouter = createTRPCRouter({
	restoreThumbnailProcedure: protectedProcedure
		.input(
			z.object({
				video_id: z.string().uuid(),
			})
		).mutation(async ({ctx, input}) => {
				{
					const {id: userId} = ctx.user
					
					if (!userId) throw new TRPCError({message: "User not found", code: "NOT_FOUND"})
					
					if (!input.video_id) throw new TRPCError({message: "Video ID not found", code: "NOT_FOUND"})
					
					const [video] = await db.select().from(videos).where(eq(videos.id, input.video_id))
					
					if (!video) throw new TRPCError({message: "Video not found", code: "NOT_FOUND"})
					
					if (!video.muxPlaybackId) throw new TRPCError({message: "Video not found", code: "NOT_FOUND"})
					
					const newThumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`
					
					console.log("newThumbnailUrl", newThumbnailUrl)
					await db.update(videos).set({
						thumbnailUrl: newThumbnailUrl,
						thumbnailKey: null
					}).where(and(eq(videos.userId, userId), eq(videos.id, input.video_id))).returning()
					
					if (video.thumbnailKey) {
						const utapi = new UTApi()
						await utapi.deleteFiles(video.thumbnailKey)
					}
					
					return {
						thumbnailUrl: newThumbnailUrl
					}
				}
			}
		),
	
	create: protectedProcedure.mutation(async ({ctx}) => {
		const {id: userId} = ctx.user
		
		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				passthrough: userId,
				playback_policies: ["public"],
				inputs: [
					{
						generated_subtitles: [
							{
								language_code: "en",
								name: "English"
							}
						]
					}
				]
			},
			cors_origin: "*"
		})
		
		
		const [video] = await db
			.insert(videos).values({
				userId,
				title: `Untitled - ${Math.floor(Math.random() * 10000)}`,
				muxStatus: 'waiting',
				muxUploadId: upload.id,
			}).returning()
		
		return {
			video: video,
			url: upload.url,
		}
	}),
	update:
		protectedProcedure
			.input(
				videoUpdateSchema
			)
			.mutation(async ({ctx, input}) => {
					
					const {id: userId} = ctx.user
					
					if (!userId) throw new TRPCError({message: "User not found", code: "NOT_FOUND"})
					
					if (!input.id) throw new TRPCError({message: "Video ID not found", code: "NOT_FOUND"})
					
					
					const [updatedVideo] = await db.update(videos).set({
						title: input.title,
						description: input.description,
						categoryId: input.categoryId,
						updatedAt: new Date(),
						visibility: input.visibility,
					}).where(and((eq(videos.id, input.id), eq(videos.userId, userId)))).returning()
					
					if (!updatedVideo) throw new TRPCError({message: "Video not found", code: "NOT_FOUND"})
					
					return updatedVideo
				}
			),
	delete:
		protectedProcedure
			.input(
				z.object({
					video_id: z.string().uuid(),
				})
			)
			.mutation(async ({ctx, input}) => {
				const {id: userId} = ctx.user
				
				if (!userId) throw new TRPCError({message: "User not found", code: "NOT_FOUND"})
				
				const [video] = await db.delete(videos).where(and(
					eq(videos.id, input.video_id),
					eq(videos.userId, userId)
				)).returning()
				
				console.log(`Deleting video: ${video?.muxAssetId}`)
				
				mux.video.assets.delete(video.muxAssetId || "")
				
				if (!video) throw new TRPCError({message: "Video not found", code: "NOT_FOUND"})
				
				return video
			}),
	getOne: baseProcedure
		.input(
			z.object(
				{
					video_id: z.string().uuid(),
				}
			)
		).query(async ({ctx, input}) => {
			const [video] = await db.select({
				...getTableColumns(videos), user: {
					...getTableColumns(users)
				},
				viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id))
			}).from(videos).where(eq(videos.id, input.video_id)).innerJoin(users, eq(videos.userId, users.id))
			
			if (!video) throw new TRPCError({message: "Video not found", code: "NOT_FOUND"})
			
			if (video.visibility === 'private' && video.user.clerkId != ctx.ClerkUserId) throw new TRPCError({
				message: "Video not found",
				code: "NOT_FOUND"
			})
			
			return video
			
		})
})
