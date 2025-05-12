"use client"
import {Button} from "@/components/ui/button";
import {Loader, UploadIcon} from "lucide-react";
import {trpc} from "@/trpc/client";

const StudioUploadModal = () => {
    const utils = trpc.useUtils()
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
        }
    })
    return (
        <Button disabled={create.isPending} onClick={() => create.mutate()} className='flex gap-2 cursor-pointer'
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
