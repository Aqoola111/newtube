'use client'

import {trpc} from "@/trpc/client";
import {Suspense, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {CopyCheckIcon, CopyIcon, Lock, MoreVerticalIcon, TrashIcon, UnlockIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {videoUpdateSchema} from "@/db/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import VideoPlayer from "@/modules/videos/components/ui/video-player";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";


interface FormSectionProps {
    videoId: string
}

export const FormSection = ({videoId}: FormSectionProps) => {
    return (
        <Suspense fallback={<p>Loading..</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <FormSectionSuspense videoId={videoId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const FormSectionSuspense = ({videoId}: FormSectionProps) => {
    const [video] = trpc.studio.getOne.useSuspenseQuery({video_id: videoId})
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const [isCopied, setIsCopied] = useState(false)
    const utils = trpc.useUtils()
    const router = useRouter()

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video
    })

    const {mutate: updateVideo, isPending} = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({video_id: videoId})
            toast.success('Video updated successfully')
        },
        onError(error) {
            toast.error(error.message)
        },
    })

    const {mutate: deleteVideo} = trpc.videos.delete.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({video_id: videoId})
            router.push('/studio')
            toast.success('Video deleted successfully')
        },
        onError(error) {
            toast.error(error.message)
        },
    })


    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
        updateVideo({
            id: videoId,
            title: data.title,
            description: data.description ?? undefined,
            categoryId: data.categoryId,
            visibility: data.visibility,
        })
    }

    const fullUrl = `${process.env.VERCEL_URL || 'localhost:3000'}/videos/${videoId}`

    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl)
        setIsCopied(true)
        toast.success('Copied to clipboard')

        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex items-center justify-between  mb-6 '>
                    <div className='flex flex-col gap-y-1'>
                        <h1 className='text-2xl font-bold'>
                            Video details
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            manage your video details here
                        </p>
                    </div>

                    <div className='flex items-center gap-x-2'>
                        <Button type='submit' disabled={isPending} variant='secondary'>
                            Save
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon'>
                                    <MoreVerticalIcon size={16}/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                    <Button variant={"ghost"}
                                            onClick={() => deleteVideo({video_id: videoId})}>
                                        <TrashIcon className='mr-2 size-4'/>
                                        Delete
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='grid grid-cols-1 xl:grid-cols-5 gap-6'>
                    <div className='space-y-8 lg:col-span-3'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder='Add a title to your video' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ""}
                                                  className='resize-none h-46 pr-10'
                                                  placeholder='Add a description to you video'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select a category'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className={'relative  overflow-hidden rounded-xl bg-gray-200 aspect-video w-[320px]'}>
                            <Image src={video.thumbnailUrl || '/placeholder.svg'} alt='thumbnail' fill
                                   className='object-cover'/>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-8 lg:col-span-2'>
                        <div className='flex flex-col gap-4 bg-gray-200 rounded-xl overflow-hidden h-fit'>
                            <div className='aspect-video overflow-hidden relative'>
                                <VideoPlayer
                                    playbackId={video.muxPlaybackId}
                                    thumbnailUrl={video.thumbnailUrl}
                                />
                            </div>

                            <div className={'p-4 flex flex-col gap-y-6'}>
                                <div className={'flex justify-between items-center gap-x-2'}>
                                    <div className={'flex flex-col gap-y-2'}>
                                        <h1 className='text-sm text-muted-foreground  capitalize'>
                                            Video link
                                        </h1>
                                        <div className={'flex items-center gap-x-2'}>
                                            <Link href={`/videos/${videoId}`} className=''>
                                                <p className='text-blue-500 line-clamp-1 '>
                                                    {fullUrl}
                                                </p>
                                            </Link>
                                            <Button variant='ghost' disabled={isCopied} className='shrink-0'
                                                    type={'button'}
                                                    onClick={() => onCopy()}>
                                                {isCopied ? <CopyCheckIcon/> : <CopyIcon/>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center '>
                                    <div className={'flex flex-col gap-y-1'}>
                                        <h1 className='text-sm  text-muted-foreground capitalize'>
                                            Video status
                                        </h1>
                                        <p className='capitalize text-sm'>
                                            {video.muxStatus}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center '>
                                    <div className={'flex flex-col gap-y-1'}>
                                        <h1 className='text-sm  text-muted-foreground capitalize'>
                                            Subtitles status
                                        </h1>
                                        <p className='capitalize text-sm'>
                                            {video.muxTrackStatus || 'No subtitles'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <FormField
                            control={form.control}
                            name='visibility'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Privacy
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select privacy of your video'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='private'>
                                                <Lock className='size-4'/>
                                                Private
                                            </SelectItem>
                                            <SelectItem value='public'>
                                                <UnlockIcon className='size-4'/>
                                                Public
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form>
    )
}
