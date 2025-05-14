import {VideosSection} from "@/modules/studio/ui/sections/videos-section";

export const StuidoView = () => {
    return (
        <div className='flex flex-col gap-y-6 pt-2.5 '>
            <div className='px-4'>
                <h1 className='text-2xl font-bold'>Channel</h1>
                <p className='text-muted-foreground text-sm'>Manage your videos</p>
            </div>
            <VideosSection/>
        </div>
    )
}