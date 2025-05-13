'use client'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/constants";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {InfiniteScroll} from "@/components/infinite-scroll";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useRouter} from "next/navigation";
import VideoThumbnail from "@/modules/videos/components/ui/video-thumbnail";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";

export const VideosSections = () => {
    return (
        <Suspense fallback={<p>Loading</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionsSuspense/>
            </ErrorBoundary>
        </Suspense>
    )
}

const statusMap: Record<
    "preparing" | "ready" | "errored" | "waiting",
    { label: string; className: string; variant?: "default" | "outline" | "destructive" }
> = {
    preparing: {
        label: "Preparing",
        variant: "outline",
        className: "text-yellow-600 border-yellow-600",
    },
    ready: {
        label: "Ready",
        variant: "default",
        className: "bg-green-600 hover:bg-green-700",
    },
    errored: {
        label: "Error",
        variant: "destructive",
        className: "",
    },
    waiting: {
        label: "Waiting",
        variant: "outline",
        className: "text-yellow-600 border-yellow-600",
    },
}

const VideosSectionsSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({limit: DEFAULT_LIMIT}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    const router = useRouter()
    return (
        <div>
            <div className='border-y'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='pl-6 w-[510px]'>Video</TableHead>
                            <TableHead className=''>Visibility</TableHead>
                            <TableHead className=''>Date</TableHead>
                            <TableHead className=''>Status</TableHead>
                            <TableHead className=''>Views</TableHead>
                            <TableHead className=''>Comments</TableHead>
                            <TableHead className=' pr-6'>Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) => page.items).map((video) => {
                            const status = video.muxStatus as keyof typeof statusMap;
                            const badge = statusMap[status] ?? statusMap["errored"];

                            return (
                                <TableRow
                                    key={video.id}
                                    onClick={() => router.push(`/studio/videos/${video.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail
                                                    previewUrl={video.previewUrl}
                                                    duration={video.duration}
                                                    thumbnailUrl={video.thumbnailUrl}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>visibility</TableCell>
                                    <TableCell>
                                        <Badge variant='outline' className='truncate'>
                                            {format(new Date(video.createdAt), ('d MMM yyyy'))}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={badge.variant} className={badge.className}>
                                            {badge.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>views</TableCell>
                                    <TableCell>comments</TableCell>
                                    <TableCell>likes</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}/>
        </div>
    )
}
