import Image from "next/image";
import {formatDuration} from "@/lib/utils";

interface VideoThumbnailProps {
    thumbnailUrl?: string | null
    previewUrl?: string | null
    duration?: number | null
}

const VideoThumbnail = ({thumbnailUrl, previewUrl, duration = 0}: VideoThumbnailProps) => {
    return (
        <div className='relative'>
            <div className='relative w-full overflow-hidden group rounded-xl aspect-video'>
                <Image src={thumbnailUrl ? thumbnailUrl : '/placeholder.svg'} alt={'thumbnail'} fill
                       className='size-full z-5 object-cover'/>
                {
                    previewUrl && <Image src={previewUrl} unoptimized={!!previewUrl} alt={'Preview'} fill
                                         className='size-full  group-hover:z-10 object-cover'/>
                }
                <div className='absolute z-10 bottom-2 right-2 p-0.5 px-2 text-xs text-white rounded-xl bg-black/80'>
                    {!duration ? '0:00' : formatDuration(duration)}
                </div>
            </div>

        </div>
    )
}
export default VideoThumbnail
