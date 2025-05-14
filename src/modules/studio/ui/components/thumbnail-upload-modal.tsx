import ResponsiveModal from "@/components/responsive-modal";
import {trpc} from '@/trpc/client'
import {UploadDropzone} from "@/lib/uploadthing";

interface ThumbnailUploadModalProps {
    videoId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}


const ThumbnailUploadModal = ({videoId, onOpenChange, open}: ThumbnailUploadModalProps) => {
    const utils = trpc.useUtils()

    const onUploadComplete = () => {
        onOpenChange(false)
        utils.studio.getOne.invalidate({video_id: videoId})
    }

    return (
        <ResponsiveModal title='Upload Thumbnail' isOpen={open} onOpenChange={onOpenChange}>
            <UploadDropzone input={{videoId}} onClientUploadComplete={onUploadComplete} endpoint={"thumbnailUploader"}/>

        </ResponsiveModal>
    )
}
export default ThumbnailUploadModal
