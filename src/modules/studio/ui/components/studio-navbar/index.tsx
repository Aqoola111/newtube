import {SidebarTrigger} from "@/components/ui/sidebar";
import Link from "next/link";
import {Logo} from "@/components/Logo";
import AuthButton from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "@/modules/studio/ui/components/studio-upload-modal";

const StudioNavbar = () => {
    return (
        <nav
            className='fixed w-full top-0 left-0 ring-0 h-16 flex items-center px-2 bg-white pr-5 z-50 border-b shadow-sm'>
            <div className='flex items-center gap-4 w-full'>
                <div className='flex items-center flex-shrink-0'>
                    <SidebarTrigger/>
                    <Link href={"/studio"}>
                        <Logo label={'Studio'}/>
                    </Link>
                </div>
                <div className='flex-1'/>
                <div className='flex-shrink-0 items-center flex gap-4'>
                    <StudioUploadModal/>
                    <AuthButton/>
                </div>
            </div>
        </nav>
    )
}
export default StudioNavbar
