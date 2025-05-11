'use client'
import {
    Carousel,
    CarouselApi,
    CarouselPrevious,
    CarouselNext,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface FilterCarouselProps {
    value?: string | null
    isLoading?: boolean
    onSelect: (value: string | null) => void
    data: {
        value: string
        label: string
    }[]
}

const FilterCarousel = ({data, isLoading, onSelect, value}: FilterCarouselProps) => {

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className='relative w-full'>
            <div
                className={cn("absolute left-12 not-md:hidden top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
                    current === 1 && "hidden"
                )}/>
            <Carousel setApi={setApi} className='w-full  px-2 md:px-12 ' opts={{
                align: 'start',
                dragFree: true,
            }}>
                <CarouselContent className='-ml-3'>
                    {!isLoading &&
                        <CarouselItem onClick={() => onSelect(null)} className='pl-3 basis-auto'>
                            <Badge variant={!value ? 'default' : 'outline'}
                                   className='rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm'
                            >
                                All
                            </Badge>
                        </CarouselItem>
                    }
                    {
                        isLoading &&
                        Array.from({length: 14}).map((_, index) => (
                            <CarouselItem className='pl-3 basis-auto' key={index}>
                                <Skeleton className='rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold'>
                                    &nbsp;
                                </Skeleton>
                            </CarouselItem>
                        ))
                    }
                    {!isLoading && data.map((item) => (
                        <CarouselItem onClick={() => onSelect(item.value)} className='pl-3 basis-auto' key={item.value}>
                            <Badge
                                variant={value === item.value ? 'default' : 'outline'}
                                className='rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm'
                                // onClick={() => {
                                //     onSelect?.(item.value)
                                // }}
                            >
                                {item.label}
                            </Badge>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='hidden md:inline-flex left-0 z-20'/>
                <CarouselNext className='hidden md:inline-flex right-0 z-20'/>
            </Carousel>
            <div
                className={cn("absolute not-md:hidden right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
                    current === count && "hidden"
                )}/>
        </div>
    )
}
export default FilterCarousel
