import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";

const skeletonArray = Array.from({length: 6}, (_, index) => index);

export const VideoSectionSkeleton = () => {
    return (
        <>
            <div className='b-y'>
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
                        {
                            skeletonArray.map((_, index) => (
                                <TableRow key={index} className="animate-pulse">
                                    <TableCell>
                                        <Skeleton className="w-40 h-24 rounded-xl "/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-20 h-6 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-24 h-6 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-16 h-6 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-12 h-6 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-12 h-6 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="w-12 h-6 rounded"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </div>
        </>
    )
}
