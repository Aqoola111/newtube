import {Button} from "@/components/ui/button";
import {UploadIcon} from "lucide-react";

const StudioUploadModal = () => {
    return (
        <Button className='flex gap-2 cursor-pointer' variant='secondary'>
            <UploadIcon size='4'/>
            Upload
        </Button>
    )
}
export default StudioUploadModal
