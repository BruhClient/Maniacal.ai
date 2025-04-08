"use client"


import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Pricing } from '@/data/pricing'
import { Check,X } from 'lucide-react'

const CustomCheck = () => <div className='bg-green-400 p-1 rounded-full '><Check className='text-black' size={15}/></div>
const CustomX = () => <div  className='bg-red-400 p-1 rounded-full '><X size={15} className='text-black'/></div>


const PricingCard = ({pricing,link,linkText,disabled = false} : {pricing : Pricing,link? : string,linkText? : string,disabled?:boolean}) => {
  return (
    <Card className={cn(pricing.isPopular && "border-primary hover:shadow-primary shadow-xl duration-200 ease-in-out transition-all","relative")}>
    
                                {pricing.isPopular && <div className='absolute top-[-15px] left-[50%] translate-x-[-50%] bg-primary px-3 text-sm py-1 rounded-lg font-serif'>Most Popular</div>}
                            <CardHeader>
                                <CardTitle className='text-2xl font-serif '>{pricing.name}</CardTitle>
                                <CardDescription>{pricing.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-4'>
                                <div>
                                    {pricing.discounts && <span className='line-through text-muted-foreground text-start pr-2'>${pricing.discounts}</span>}
                                    
                                    <span className='text-4xl font-serif font-bold'>${pricing.price}</span> /month
                                </div>
                                <Button className='w-full' variant={"outline"} disabled={true} asChild={!disabled}>
                                    <Link href={link ? link : "/signin"} target={link && "_blank"} >
                                        {linkText ? linkText : "Get Started" }
                                    </Link>
                                </Button>
    
                                <div className='flex flex-col gap-2 py-5 px-1'>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        <CustomCheck /> {pricing.numOfProjects} projects
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.support ? <CustomCheck /> : <CustomX />} 24/7 support
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        <CustomCheck/> {pricing.fileSize}MB File Upload
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.sharableLinks ? <CustomCheck /> : <CustomX />} Sharable links
                                    </div>
                                    <div className='flex items-center text-lg gap-3 font-serif '>
                                        {pricing.AiAnaysis ? <CustomCheck /> : <CustomX />} Unlimited Ai Chats
                                    </div>
                                    

                                    
                                </div>
                            </CardContent>
                        </Card>
  )
}

export default PricingCard
