'use client'

import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";
import {trpc} from "@/trpc/client";
import {cn} from "@/lib/utils";
import VideoPlayer from "@/modules/videos/components/ui/video-player";

interface VideoSectionProps {
    videoId: string
}

const VideoSectionSuspense = ({videoId}: VideoSectionProps) => {
    const [data] = trpc.videos.getOne.useSuspenseQuery({video_id: videoId})

    return (
        <>
            <div className={cn('aspect-video rounded-xl bg-black relative overflow-hidden')}>
                <VideoPlayer playbackId={data.muxPlaybackId} onPlay={() => {
                }} thumbnailUrl={data.thumbnailUrl}/>
            </div>

        </>
    )
}

const VideoSection = ({videoId}: VideoSectionProps) => {
    return (
        <Suspense fallback={<p>Loading video...</p>}>
            <ErrorBoundary fallback={<p>Error loading video</p>}>
                <VideoSectionSuspense videoId={videoId}/>
            </ErrorBoundary>
        </Suspense>
    )
}
export default VideoSection
