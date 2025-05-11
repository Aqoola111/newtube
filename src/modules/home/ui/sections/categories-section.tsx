'use client'
import {trpc} from "@/trpc/client";
import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";
import FilterCarousel from "@/components/filter-carousel";
import {useRouter} from "next/navigation";

interface CategorySectionProps {
    categoryId?: string
}

export const CategoriesSection = ({categoryId}: CategorySectionProps) => {
    return (
        <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={() => {
        }}/>}>
            <ErrorBoundary fallback={<p></p>}>
                <CategoriesSectionSuspense categoryId={categoryId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const CategoriesSectionSuspense = ({categoryId}: CategorySectionProps) => {
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const router = useRouter();
    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href)
        if (value) {
            url.searchParams.set('categoryId', value)
        } else {
            url.searchParams.delete('categoryId')
        }

        router.push(url.toString())
    }
    const data = categories.map(category => {
        return {
            value: category.id,
            label: category.name,
        }
    })
    return (
        <div>
            <FilterCarousel onSelect={onSelect} value={categoryId} data={data}/>
        </div>
    )
}
