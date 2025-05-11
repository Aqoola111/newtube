import {useUser} from "@clerk/nextjs";
import {SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import {Skeleton} from "@/components/ui/skeleton";

const StudioSideBarHeader = () => {
    const {user} = useUser()
    const {state} = useSidebar()

    if (!user) return <SidebarHeader className='flex items-center p-4 justify-center'>
        <Skeleton className='size-[112px] rounded-full'/>
        <div className='flex items-center flex-col mt-2 gap-y-1'>
            <Skeleton className='w-[100px] h-4 rounded-full'/>
            <Skeleton className='w-[80px] h-4 rounded-full '/>
        </div>
    </SidebarHeader>

    if (state === 'collapsed') {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip='Your profile' className='w-full' asChild>
                    <Link href="/users/current">
                        <UserAvatar className='shadow-lg border' imgUrl={user.imageUrl} size='xs' name={user?.fullName || "user"}/>
                        <span className='text-sm'>
                            Your profile
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarHeader className='flex items-center p-4 justify-center'>
            <Link href={'/users/current'}>
                <UserAvatar imgUrl={user?.imageUrl} name={user?.fullName ?? "user"}
                            className='size-[112px] hover:opacity-80 transition-opacity shadow-lg border'/>
            </Link>
            <div className='flex items-center flex-col gap-y-1 mt-2'>
                <h1 className='text-lg font-medium '>
                    Your profile
                </h1>
                <h1 className='text-xs text-muted-foreground tracking-wide '>
                    {user.fullName}
                </h1>
            </div>
        </SidebarHeader>
    )
}
export default StudioSideBarHeader
