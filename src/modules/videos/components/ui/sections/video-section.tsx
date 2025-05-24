'use client'

import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";
import {trpc} from "@/trpc/client";
import {cn} from "@/lib/utils";
import VideoPlayer from "@/modules/videos/components/ui/video-player";
import VideoBanner from "@/modules/videos/components/video-banner";
import VideoTopRow from "@/modules/videos/components/ui/video-top-row";
import {useAuth} from "@clerk/nextjs";

interface VideoSectionProps {
	videoId: string
}

const VideoSectionSuspense = ({videoId}: VideoSectionProps) => {
	const [video] = trpc.videos.getOne.useSuspenseQuery({video_id: videoId})
	const {isSignedIn} = useAuth()
	const utils = trpc.useUtils()
	
	const createView = trpc.videoViews.create.useMutation({
		onSuccess: async () => {
			await utils.videos.getOne.invalidate({video_id: videoId})
		}
	})
	
	const handlePlay = () => {
		if (!isSignedIn) return
		createView.mutate({videoId})
	}
	
	return (
		<>
			<div className={cn('aspect-video rounded-xl bg-black relative overflow-hidden',
				video.muxStatus !== 'ready' && 'rounded-b-none'
			)}>
				<VideoPlayer playbackId={video.muxPlaybackId} onPlay={handlePlay} thumbnailUrl={video.thumbnailUrl}/>
			</div>
			<VideoBanner status={video.muxStatus}/>
			<VideoTopRow video={video}/>
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
