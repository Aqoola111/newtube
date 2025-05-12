'use client'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/constants";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {InfiniteScroll} from "@/components/infinite-scroll";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useRouter} from "next/navigation";

export const VideosSections = () => {
    return (
        <Suspense fallback={<p>Loading</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionsSuspense/>
            </ErrorBoundary>
        </Suspense>
    )
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
                            <TableHead className='text-right'>Likes</TableHead>
                            <TableHead className='text-right'>Comments</TableHead>
                            <TableHead className='text-right pr-6'>Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) => page.items).map((video) => (
                            <TableRow key={video.id} onClick={() => router.push(`/studio/videos/${video.id}`)}
                                      className='cursor-pointer'>
                                <TableCell>
                                    {video.title}
                                </TableCell>
                                <TableCell>visibility</TableCell>
                                <TableCell>status</TableCell>
                                <TableCell>date</TableCell>
                                <TableCell>views</TableCell>
                                <TableCell>comments</TableCell>
                                <TableCell>likes</TableCell>
                            </TableRow>

                        ))}
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
