'use client'
import {Button} from "@/components/ui/button";
import {ClapperboardIcon, UserIcon} from "lucide-react";
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs'

const AuthButton = () => {
    return (
        <>
            <SignedOut>
                <SignInButton mode={"modal"}>
                    <Button
                        className='px-4 py-2 text-sm font-medium hover:text-blue-700 text-blue-600 border bg-blue-500/200 rounded-full shadow-none'
                        variant='outline'>
                        <UserIcon/>
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Button variant='outline' size='icon' className='rounded-full'>
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link href={'/studio'} label={'Studio'}
                                             labelIcon={<ClapperboardIcon className='size-4'/>}>
                            </UserButton.Link>
                        </UserButton.MenuItems>
                    </UserButton>
                </Button>
            </SignedIn>
        </>
    )
}
export default AuthButton
