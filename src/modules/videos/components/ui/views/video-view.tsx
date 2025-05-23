import VideoSection from "@/modules/videos/components/ui/sections/video-section";
import {SuggestionsSection} from "@/modules/videos/components/ui/sections/suggestions-section";
import CommentsSection from "@/modules/videos/components/ui/sections/comments-section";

interface VideoViewProps {
	videoId: string
}

const VideoView = ({videoId}: VideoViewProps) => {
	
	return (
		<div className={'flex flex-col max-w-[1700px] pt-2.5 px-4 mb-10  '}>
			<div className={'flex flex-col xl:flex-row gap-6'}>
				<div className={'flex-1 min-w-0'}>
					<VideoSection videoId={videoId}/>
					<div className={'xl:hidden block mt-4'}>
						<SuggestionsSection/>
					</div>
					<CommentsSection/>
				</div>
				<div className={'xl:block hidden w-full xl:w-[380px] 2xl:w-[460px] shrink-1'}>
					<SuggestionsSection/>
				</div>
			</div>
		</div>
	)
}
export default VideoView
