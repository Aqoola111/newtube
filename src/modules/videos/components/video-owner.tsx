import {videoGetOneOutput} from "@/modules/videos/types";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import {useAuth} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
	user: videoGetOneOutput['user']
	videoId: string
}

const VideoOwner = ({user, videoId}: VideoOwnerProps) => {
	const {userId} = useAuth()
	
	
	return (
		<div className={'flex items-center sm:items-start gap-3 justify-between sm:justify-start min-w-0'}>
			<Link href={`/user/${user.id}`}>
				<div className={'flex items-center gap-3  min-w-0'}>
					<UserAvatar size={"lg"} imgUrl={user.imageUrl} name={user.name}/>
					<div className={'flex flex-col gap-1 min-w-0'}>
						<UserInfo name={user.name}/>
						<span className={'text-sm text-muted-foreground line-clamp-1'}>
                        {0} Subscribers
                    </span>
					</div>
				</div>
			</Link>
			{userId === user.clerkId && (
				<Button variant='secondary' className='rounded-full' asChild>
					<Link href={`/studio/videos/${videoId}`}>
						Edit video
					</Link>
				</Button>
			)}
			{userId !== user.clerkId && (
				<SubscriptionButton disabled={false} isSubscribed={false} onClick={() => {
				}} size={'lg'}/>
			)}
		</div>
	)
}
export default VideoOwner
