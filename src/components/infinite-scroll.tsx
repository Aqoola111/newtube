import {useIntersectionObserver} from "@/hooks/use-intersection-observer";
import {useEffect} from "react";
import {Button} from "./ui/button";

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage: () => void
}

export const InfiniteScroll = ({
                                   isManual = false,
                                   isFetchingNextPage,
                                   hasNextPage,
                                   fetchNextPage
                               }: InfiniteScrollProps) => {
    const {targetRef, isIntersecting} = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: '100px'
    })

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
            fetchNextPage()
        }
    }, [isIntersecting, hasNextPage, isManual, fetchNextPage, isFetchingNextPage])

    return (
        <div className='flex flex-col gap-4 items-center p-4 '>
            <div className='h-1' ref={targetRef}/>
            {hasNextPage ?
                <Button variant='secondary' disabled={isFetchingNextPage || !hasNextPage}
                        onClick={() => fetchNextPage()}>
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button> :
                <p className='text-muted-foreground text-xs'>You have reached the end of the list</p>
            }
        </div>
    )
}

