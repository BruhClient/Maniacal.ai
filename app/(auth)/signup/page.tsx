"use client"

import SignUpForm from "@/components/forms/auth/signup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function SignupPage() {
    return ( <div className="h-[90vh] flex w-full justify-center items-center flex-col">
        <div className="w-full max-w-[500px] px-3 flex justify-center items-center flex-col gap-4">
        <h1 className="text-center text-[25px] font-semibold">Account</h1>
            <div className="text-muted-foreground text-sm">
                Continue with Github or Google
            </div>
            <Suspense>
                <SignUpForm/>
            </Suspense>
            
        </div>
        <Button variant={"link"} asChild><Link href={"/"}>Back to home page</Link></Button>
        
        
    </div> );
}

export default SignupPage;