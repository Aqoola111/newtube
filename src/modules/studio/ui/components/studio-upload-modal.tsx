"use client"
import {Button} from "@/components/ui/button";
import {Loader, UploadIcon} from "lucide-react";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";

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
    )
}
export default StudioUploadModal
