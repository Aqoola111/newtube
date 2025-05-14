import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {videos, videoUpdateSchema} from "@/db/schema";
import {db} from "@/db";
import {mux} from "@/lib/mux";
import {and, eq} from "drizzle-orm";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const videosRouter = createTRPCRouter({
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
    update: protectedProcedure
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
    delete: protectedProcedure
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
        })
})
