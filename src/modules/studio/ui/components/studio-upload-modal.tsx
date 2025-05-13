"use client"
import {Button} from "@/components/ui/button";
import {Loader, Loader2Icon, UploadIcon} from "lucide-react";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";
import ResponsiveModal from "@/components/responsive-modal";
import StudioUploader from "@/modules/studio/ui/components/studio-uploader";

const StudioUploadModal = () => {
    const utils = trpc.useUtils()
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success('Video uploaded successfully')
            utils.studio.getMany.invalidate()
        },
        onError: (Error) => {
            toast.error(Error.message)
        }
    })
    return (
        <>
            <ResponsiveModal isOpen={!!create.data?.url} onOpenChange={() => {
                create.reset()
            }} title={'Upload Video'} description={'Upload a new video to your channel'}>
                {create.data?.url ?
                    <StudioUploader onSuccess={() => {
                    }} endpoint={create.data.url}/> :
                    <div className='flex justify-center items-center h-full'>
                        <Loader2Icon className='animate-spin text-muted-foreground'/>
                    </div>}
            </ResponsiveModal>
            <Button disabled={create.isPending} onClick={() => {
                create.mutate()
                toast('Uploading video...')
            }} className='flex gap-2 cursor-pointer'
                    variant='secondary'>
                {
                    create.isPending && <>
                        <Loader size={4} className='animate-spin'/>
                        Uploading...
                    </>
                }
                {
                    !create.isPending && <>
                        <UploadIcon size='4'/>
                        Upload
                    </>
                }

            </Button>
        </>
    )
}
export default StudioUploadModal
