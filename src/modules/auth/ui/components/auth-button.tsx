import {Button} from "@/components/ui/button";
import {UserIcon} from "lucide-react";

const AuthButton = () => {
    return (
        <Button
            className='px-4 py-2 text-sm font-medium hover:text-blue-700 text-blue-600 border bg-blue-500/200 rounded-full shadow-none'
            variant='outline'>
            <UserIcon/>
            Sign In
        </Button>
    )
}
export default AuthButton
