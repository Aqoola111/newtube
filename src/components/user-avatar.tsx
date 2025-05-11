import {cva, type VariantProps} from "class-variance-authority";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

const avatarVariants = cva("", {
    variants: {
        size: {
            default: "h-9 w-9",
            xs: "h-4 w-4",
            sm: "h-6 w-6",
            lg: "h-10 w-10",
            xl: "h-[160px] w-[160px]",
        }
    },
    defaultVariants: {
        size: "default"
    }
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
    className?: string
    imgUrl: string
    name: string
    onClick?: () => void
}

const UserAvatar = ({imgUrl, size, name, onClick, className}: UserAvatarProps) => {
    return (
        <Avatar className={cn(avatarVariants({size, className}), "cursor-pointer")} onClick={onClick}>
            <AvatarImage src={imgUrl} alt={name}/>
        </Avatar>
    )
}
export default UserAvatar
