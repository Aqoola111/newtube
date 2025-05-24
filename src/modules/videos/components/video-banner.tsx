import {videoGetOneOutput} from "@/modules/videos/types";
import {AlertTriangleIcon} from "lucide-react";

interface VideoBannerProps {
	status: videoGetOneOutput['muxStatus']
}

const VideoBanner = ({status}: VideoBannerProps) => {
	if (status === 'ready') return null
	return (
		<div className='bg-yellow-500/70 py-3 px-4 flex gap-1 items-center  rounded-b-xl'>
			<AlertTriangleIcon className='text-black shrink-0 size-4'/>
			<p className={'text-xs md:text-sm font-medium line-clamp-1'}>
				This video is currently being processed. Please check back later.
			</p>
		</div>
	)
}
export default VideoBanner
