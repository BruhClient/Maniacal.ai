"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useSessionUser from '@/hooks/use-session-user'
import { useUploadThing } from '@/lib/uploadthing'
import { bytesToMB, cn } from '@/lib/utils'
import { UploadFormPayload, UploadFormSchema } from '@/schema/upload-form'
import { fetchAndExtractPdfText } from '@/server/actions/langchain'
import { generatePDFSummary, generateSimplifiedPDFContent } from '@/server/actions/pdf'
import { hasPermission } from '@/server/actions/permissions'
import { createProject } from '@/server/db/projects'
import { decrementProjectsLeft } from '@/server/db/users'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Upload } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'


const UploadForm = () => {

    const [isPending,startTransition] = useTransition()
    const { startUpload } = useUploadThing('pdfUploader', {
        
        onUploadError: (err) => {
            setLoadingState(null)
          toast.error("PDF Upload failed. Please check your internet connection.")
          
        },
        
      });

    const user = useSessionUser()

    const [loadingState,setLoadingState] = useState<string | null>(null)
    const form = useForm<UploadFormPayload>({ 
        resolver : zodResolver(UploadFormSchema), 
        defaultValues : { 
            file : "", 
            name : ""


        }
    })

    const queryClient = useQueryClient()
    

    const onSubmit = (values : UploadFormPayload) => {
        
        
        startTransition(async () => {

            
            try { 

                const fileSize = values.file[0].size as number


                setLoadingState("Checking user details...")
                const isAllowed = await hasPermission(fileSize)
                
                if (!isAllowed || !isAllowed.allowed) { 
                    toast.error(isAllowed.message)
                    
                    return
                } 

                const {file,name} = UploadFormSchema.parse(values)
                
                setLoadingState("Uploading files...")
                const resp = await startUpload([file[0]])

                
                if (!resp)  return

                const {key ,serverData : {fileUrl : pdfUrl} } = resp[0] 

                setLoadingState("Extracting PDF Text...")
                const pdfText = await fetchAndExtractPdfText(pdfUrl)

              


              
                setLoadingState("Generating Summary...")
                const res = await generatePDFSummary(pdfText,key)
                
                

                if (!res.success || !res.data) { 
                    toast.error(res.message)
                    
                    
                    return 
                } 

                const summary = res.data




                setLoadingState("Generating AI Chatbot...")
                const data = await generateSimplifiedPDFContent(pdfText,key)
                
                
                if (!data.success) { 
                    toast.error(res.message)
                    
                    return
                } 




                if (user?.planType === "free" ) { 
                    const res = await decrementProjectsLeft(user!.id)

                    if (!res) { 
                        toast.error("Failed to create project. Please check your internet connection")
                        
                        return 
                    } else { 
                        queryClient.invalidateQueries({queryKey : ["projectsLeft",user.id]})
                    }
                }

                setLoadingState("Creating Project...")

                
                const result = await createProject({ 
                        name, 
                        content : data.data!, 
                        summary , 
                        pdfUrl, 
                })

                if (result.success) { 

                    toast.success("Project created !")

                    form.setValue("name","")

                } else { 
                    
                    toast.error("Failed to create project. Please check your internet connection")
                }

            } catch(error) { 
                
               
                toast.error("Something went wrong. Please check your internet connection")
            }

        })

    }
   
  return (
    <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            
            <FormField
                        control={form.control}
                        name ="name"
                        render={({field}) => (
                            <FormItem >
                                <FormLabel>
                                    Project Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="name"/>
                                    
                                </FormControl>
                            

                               <FormMessage />
                            </FormItem>

                            
                            
                        )}
            />

            <FormField
                                    control={form.control}
                                    name ="file"
                                    render={({field}) => (
                                        <FormItem >
                                            <FormLabel>
                                                PDF {field.value && `( ${bytesToMB(field.value[0].size)}MB ) `}
                                            </FormLabel>
                                            <FormControl>
                                            <Input
                                                    id="file"
                                                    type="file"
                                                    
                                                    accept="application/pdf"
                                                    required
                                                    
                                                    onChange={(value) => {
                                                        
                                                        field.onChange(value.target.files)
                                                    }
                                                        
                                                    }
                                                    className={cn(isPending && 'opacity-50 cursor-not-allowed')}
                                                    disabled={isPending}
                                                />
                                                
                                                
                                                

                                                

                                                
                                                
                                            </FormControl>

                                           
                                        
                                            <FormMessage />
                                           
                                        </FormItem>
            
                                        
                                        
                                    )}
                                />

                               
                                
                
        
        
        <Button disabled={isPending} className='flex items-center'>
            {isPending ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingState}
            </>
            ) : (
            <><Upload /> Upload your PDF</>
            )}
        </Button>
      
        </form>
    </Form>
    
  )
}

export default UploadForm
