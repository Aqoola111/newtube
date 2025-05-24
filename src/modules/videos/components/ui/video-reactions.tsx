import {ThumbsDown, ThumbsUpIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";

export const VideoReactions = () => {
	const viewerReaction: 'like' | 'dislike' = 'like'
	return (
		<div className="flex flex-none items-center">
			<Button variant='secondary' className='rounded-l-full rounded-r-none gap-2 pr-4'>
				<ThumbsUpIcon className={cn('size-5', viewerReaction === 'like' && 'fill-black')}/>
				{1}
			</Button>
			<Separator className='h-7' orientation={'vertical'}/>
			<Button variant='secondary' className='rounded-r-full rounded-l-none pl-4'>
				<ThumbsDown className={cn('size-5', viewerReaction !== 'like' && 'fill-black')}/>
				{1}
			</Button>
		</div>
	)
}

