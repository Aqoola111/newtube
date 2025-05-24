import {Button} from "@/components/ui/button";

import {cn} from "@/lib/utils";
import {ComponentProps} from "react";

type ButtonProps = ComponentProps<typeof Button>

interface SubscriptionButtonProps {
	onClick: ButtonProps['onClick']
	disabled?: boolean
	isSubscribed?: boolean
	className?: string
	size: ButtonProps['size']
}

const SubscriptionButton = ({disabled, size, className, isSubscribed, onClick}: SubscriptionButtonProps) => {
	return (
		<Button disabled={disabled} onClick={onClick} size={size} className={cn(className, ' rounded-lg',
			isSubscribed ? 'bg-[#615558] hover:bg-[#FF2056]' : 'bg-[#FF2056] hover:bg-[#615558]/80 ',
		)}>
			{
				isSubscribed ? "Unsubscribe" : "Subscribe"
			}
		</Button>
	)
}
export default SubscriptionButton
