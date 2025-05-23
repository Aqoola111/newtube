import {HydrateClient, trpc} from "@/trpc/server";
import VideoView from "@/modules/videos/components/ui/views/video-view";

interface PageProps {
    params: Promise<{ videoId: string }>
}

const Page = async ({params}: PageProps) => {
    const {videoId} = await params

    void trpc.videos.getOne.prefetch({video_id: videoId})

    return (
        <HydrateClient>
            <VideoView videoId={videoId}/>
        </HydrateClient>
    )
}
export default Page
