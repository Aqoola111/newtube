import {SidebarTrigger} from "@/components/ui/sidebar";
import Link from "next/link";
import {Logo} from "@/components/Logo";
import SearchInput from "@/modules/ui/components/home-navbar/search-input";
import AuthButton from "@/modules/auth/ui/components/auth-button";

const HomeNavbar = () => {
    return (
        <nav className='fixed w-full top-0 left-0 ring-0 h-16 flex items-center px-2 bg-white pr-5 z-50'>
            <div className='flex items-center gap-4 w-full'>
                <div className='flex items-center flex-shrink-0'>
                    <SidebarTrigger/>
                    <Link href={"/"}>
                        <Logo/>
                    </Link>
                </div>
                <div className='flex flex-1 justify-center max-w-[720px] mx-auto'>
                    <SearchInput/>
                </div>
                <div className='flex-shrink-0 items-center flex gap-4'>
                    <AuthButton/>
                </div>
            </div>
        </nav>
    )
}
export default HomeNavbar
