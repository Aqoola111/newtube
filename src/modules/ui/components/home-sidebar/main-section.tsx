'use client'
import {FlameIcon, HomeIcon, PlaySquareIcon} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
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
                                        onClick={() => {
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
