'use client'
import {HistoryIcon, ListVideoIcon, ThumbsUpIcon} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {useAuth, useClerk} from "@clerk/nextjs";

const items = [
    {
        title: 'History',
        url: '/playlists/history',
        icon: HistoryIcon,
        auth: true,
    },
    {
        title: 'Liked videos',
        url: '/playlists/liked',
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title: 'all playlists',
        url: '/playlists',
        icon: ListVideoIcon,
        auth: true,
    }
]

const PersonalSection = () => {
    const clerk = useClerk();
    const {isSignedIn} = useAuth()

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarGroupLabel>
                    You
                </SidebarGroupLabel>
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
export default PersonalSection
