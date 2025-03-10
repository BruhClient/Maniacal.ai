"use client"

import useSessionUser from "@/hooks/use-session-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Settings, Sparkles, User, Wallet } from "lucide-react";
import { signOut } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProfileForm from "../forms/profile";

function UserProfile() {
    const user = useSessionUser()
    
    
    if (!user) { 
        return <Skeleton className="w-10 aspect-square rounded-full"/>
    }

    
    return ( <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar className="w-10 h-10">
                <AvatarImage src={user.image ?? undefined} alt="Profile" ></AvatarImage>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">

            <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={user.image ?? undefined} alt="Profile" ></AvatarImage>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <div>
                    <div>{user.username}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                
                
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem >
                <Sparkles /> Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            

                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Settings /> Account settings</DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex gap-2 items-center"><Settings /> Account settings</DialogTitle>
                            <DialogDescription>Make changes to your account here</DialogDescription>
                        </DialogHeader>
                        <EditProfileForm/>
                    </DialogContent>
                </Dialog>
                
           
            <DropdownMenuItem >
                <Wallet /> Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({
                callbackUrl : "/signin"
            })}>
                <LogOut />Sign out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu> );
}

export default UserProfile;