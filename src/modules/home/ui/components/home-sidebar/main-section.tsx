'use client'
import {FlameIcon, HomeIcon, PlaySquareIcon} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {useAuth, useClerk} from "@clerk/nextjs";
import Link from "next/link";

const items = [
    {
        title: 'home',
        url: '/',
        icon: HomeIcon,
    },
    {
        title: 'subscriptions',
        url: '/feed/subscriptions',
        icon: PlaySquareIcon,
        auth: true,
    },
    {
        title: 'trending',
        url: '/feed/trending',
        icon: FlameIcon,
    }
]

const MainSection = () => {
    const clerk = useClerk();
    const {isSignedIn} = useAuth()

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {
                        items.map((item) => {

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={false}
                                        onClick={(e) => {
                                            if (!isSignedIn && item.auth) {
                                                e.preventDefault()
                                                return clerk.openSignIn();
                                            }
                                        }}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon/>
                                            <span className='text-sm font-medium'>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })
                    }

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
export default MainSection
