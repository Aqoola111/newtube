import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon} from "lucide-react";
import {toast} from "sonner";

interface DropdownMenuProps {
	videoId: string
	variant?: 'secondary' | 'ghost'
	onRemove?: () => void
}

const VideoMenu = ({onRemove, videoId, variant}: DropdownMenuProps) => {
	
	const onShare = () => {
		const fullUrl = `${process.env.VERCEL_URL || 'localhost:3000'}/videos/${videoId}`
		navigator.clipboard.writeText(fullUrl).then((r) => {
			toast.success("Link copied to clipboard")
		})
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} size={'icon'} className='rounded-full'>
					<MoreVerticalIcon/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem onClick={onShare}>
					<ShareIcon className='mr-2 size-4'/>
					share
				</DropdownMenuItem>
				<DropdownMenuItem>
					<ListPlusIcon className='mr-2 size-4' onClick={() => {
					}}/>
					Add to playlist
				</DropdownMenuItem>
				{onRemove && (
					<DropdownMenuItem>
						<Trash2Icon className='mr-2 size-4' onClick={() => {
						}}/>
						Remove
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
export default VideoMenu
