import {videoGetOneOutput} from "@/modules/videos/types";
import VideoOwner from "@/modules/videos/components/video-owner";
import {VideoReactions} from "@/modules/videos/components/ui/video-reactions";
import VideoMenu from "@/modules/videos/components/ui/video-menu";
import {VideoDescription} from "@/modules/videos/components/ui/video-description";
import {useMemo} from "react";
import {format, formatDistanceToNow} from "date-fns";


interface videoTopRowProps {
	video: videoGetOneOutput
}


const VideoTopRow = ({video}: videoTopRowProps) => {
	const compactViews = useMemo(() => {
		return Intl.NumberFormat("en", {
			notation: 'compact'
		}).format(video.viewCount)
	}, [video.viewCount])
	const extendedViews = useMemo(() => {
		return Intl.NumberFormat("en", {
			notation: 'standard'
		}).format(video.viewCount)
	}, [video.viewCount])
	
	const compactDate = useMemo(() => {
		return formatDistanceToNow(video.createdAt, {addSuffix: true})
	}, [video.createdAt])
	
	const extendedDate = useMemo(() => {
		return format(video.createdAt, 'd MMM yyyy')
	}, [video.createdAt])
	return (
		<div className={'flex flex-col gap-4 mt-4'}>
			<h1 className={'text-2xl font-semibold text-gray-900'}>
				{video.title}
			</h1>
			<div className={'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'}>
				<VideoOwner user={video.user} videoId={video.id}/>
				<div
					className={'flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 gap-2'}>
					<VideoReactions/>
					<VideoMenu variant='ghost' videoId={video.id}/>
				</div>
			</div>
			<VideoDescription compactViews={compactViews} extendedViews={extendedViews} compactDate={compactDate}
							  extendedDate={extendedDate} description={video.description}/>
		</div>
	)
}
export default VideoTopRow
