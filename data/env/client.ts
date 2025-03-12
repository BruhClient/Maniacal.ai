import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  emptyStringAsUndefined: true,
  client: {
    NEXT_PUBLIC_VERCEL_URL : z.string().url()
  },
  experimental__runtimeEnv: {
    
    NEXT_PUBLIC_VERCEL_URL : process.env.NEXT_PUBLIC_VERCEL_URL, 
  },
})