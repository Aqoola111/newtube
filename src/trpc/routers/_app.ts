import {createTRPCRouter} from '../init';
import {categoriesRouter} from "@/modules/categories/server/procedures";
import {studioRouter} from "@/modules/studio/server/procedures";
import {videoViewsRouter} from '@/modules/video-views/procedures';
import {videosRouter} from "@/modules/videos/server/procedures";


export const appRouter = createTRPCRouter({
	studio: studioRouter,
	categories: categoriesRouter,
	videos: videosRouter,
	videoViews: videoViewsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;