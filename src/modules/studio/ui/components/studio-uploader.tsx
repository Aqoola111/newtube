import MuxUploader, {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus
} from "@mux/mux-uploader-react";
import {UploadIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface studioUploaderProps {
    endpoint?: string | null
    onSuccess?: () => void
}

const UPLOADER_ID = "video-uploader"

const StudioUploader = ({endpoint, onSuccess}: studioUploaderProps) => {
    return (
        <div>
            <MuxUploader id={UPLOADER_ID} className={'hidden group/uploader'} endpoint={endpoint}
                         onSuccess={onSuccess}/>
            <MuxUploaderDrop muxUploader={UPLOADER_ID} className='group/drop'>
                <div slot='heading' className='flex flex-col gap-6 items-center'>
                    <div className='flex items-center justify-center gap-2 rounded-full bg-muted size-32'>
                        <UploadIcon
                            className='size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300'/>
                    </div>
                    <div className='flex flex-col gap-2 text-center'>
                        <p className='text-lg font-bold tracking-wide'>
                            Drag and drop your video here to upload
                        </p>
                        <p className='text-sm text-muted-foreground tracking-wide'>
                            Your videos will be private until you publish them
                        </p>
                    </div>
                    <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
                        <Button type='button' className='rounded-full'>
                            Select files
                        </Button>

                    </MuxUploaderFileSelect>
                </div>
                <span slot={'separator'} className='hidden'/>

                <MuxUploaderStatus muxUploader={UPLOADER_ID} className={'text-sm py-10'}/>
                <MuxUploaderProgress
                    muxUploader={UPLOADER_ID}
                    className='text-sm'
                    type='percentage'
                />
                <MuxUploaderProgress
                    muxUploader={UPLOADER_ID}
                    type='bar'
                />

            </MuxUploaderDrop>
        </div>
    )
}
export default StudioUploader
