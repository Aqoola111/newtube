'use client'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/constants";
import {Suspense, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {InfiniteScroll} from "@/components/infinite-scroll";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import VideoThumbnail from "@/modules/videos/components/ui/video-thumbnail";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {Edit, Loader, LockIcon, Trash, UnlockIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {VideoSectionSkeleton} from "@/modules/studio/ui/sections/videos-section-skeleton";
import {statusMap} from "../../constants";
import {useRouter} from "next/navigation";

export const VideosSection = () => {
    return (
        <Suspense fallback={<VideoSectionSkeleton/>}>
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
    const utils = trpc.useUtils()
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const router = useRouter()

    const {mutate: updateVideo, status: mutationStatus} = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            toast('Video updated successfully')
            setUpdatingId(null)
        },
        onError(error) {
            toast.error(error.message)
            setUpdatingId(null)
        },
        onMutate: (vars) => {
            setUpdatingId(vars.id || null)
        }
    })

    const {mutate: deleteVideo} = trpc.videos.delete.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            router.push('/studio')
            toast.success('Video deleted successfully')
        },
        onError(error) {
            toast.error(error.message)
        },
    })

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

                            const handlePrivateChange = (e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault()
                                updateVideo({
                                    id: video.id,
                                    visibility: video.visibility === 'private' ? 'public' : 'private'
                                })
                            }

                            return (
                                <TableRow
                                    key={video.id}
                                    className="transition-all duration-300"
                                >
                                    <TableCell>
                                        <div className="flex items-center  gap-4 w-full pl-5">
                                            <div
                                                className="relative aspect-video  z-50 w-40 rounded-xl shadow-xl  shrink-0">
                                                <VideoThumbnail
                                                    previewUrl={video.previewUrl}
                                                    duration={video.duration}
                                                    thumbnailUrl={video.thumbnailUrl}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            <div className='flex items-center gap-2'>
                                                {
                                                    <Button onClick={(e) => handlePrivateChange(e)}
                                                            variant='outline'
                                                            className='group hover:bg-accent hover:scale-105'>

                                                        <h1 className='text-sm font-semibold'>
                                                            {video.visibility}
                                                        </h1>
                                                        {
                                                            mutationStatus !== "success" && updatingId === video.id
                                                                ? <Loader size={16} className='animate-spin'/> :
                                                                <>
                                                                    <UnlockIcon
                                                                        size={16}
                                                                        className={cn(
                                                                            "transition-all duration-300",
                                                                            video.visibility === "public"
                                                                                ? "inline-flex group-hover:hidden"
                                                                                : "hidden group-hover:inline-flex"
                                                                        )}
                                                                    />

                                                                    <LockIcon
                                                                        size={16}
                                                                        className={cn(
                                                                            "transition-all duration-300",
                                                                            video.visibility === "private"
                                                                                ? "inline-flex group-hover:hidden"
                                                                                : "hidden group-hover:inline-flex"
                                                                        )}
                                                                    />

                                                                </>
                                                        }
                                                    </Button>
                                                }
                                            </div>
                                        }
                                    </TableCell>
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
                                    <TableCell>
                                        <Button variant='outline' className='mr-2'
                                                onClick={() => router.push(`/studio/videos/${video.id}`)}>
                                            <Edit size={16}/>
                                        </Button>
                                        <Button onClick={() => deleteVideo({video_id: video.id})} variant='destructive'
                                                className='bg-white text-destructive hover:text-white border-destructive border'>
                                            <Trash size={16}/>
                                        </Button>
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                </TableRow>
                            )
                                ;
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
