import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {videos} from "@/db/schema";
import {db} from "@/db";
import {mux} from "@/lib/mux";
import {eq} from "drizzle-orm";
import {z} from "zod";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ctx}) => {
        const {id: userId} = ctx.user

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ["public"]
            },
            cors_origin: "*"
        })


        const video = await db
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
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1).max(100).optional(),
                description: z.string().optional(),
                visibility: z.enum(['public', 'private']).optional(),
            })
        )
        .mutation(async ({ctx, input}) => {
                const {id: userId} = ctx.user

                if (!userId) throw new Error("User not found")

                const updatedVideo = await db.update(videos).set({
                    title: input.title,
                    description: input.description,
                    visibility: input.visibility,
                }).where(eq(videos.id, input.id)).returning()

                return updatedVideo
            }
        )

})
