import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {videos} from "@/db/schema";
import {db} from "@/db";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ctx}) => {
        const {id: userId} = ctx.user

        const video = await db
            .insert(videos).values({
                userId,
                title: `Untitled - ${Math.floor(Math.random() * 10000)}`,
            }).returning()

        return {
            video: video
        }
    })
})
