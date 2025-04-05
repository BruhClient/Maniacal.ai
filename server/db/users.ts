"use server"
import { db, users } from "@/db/schema"
import { eq, InferModel } from "drizzle-orm"

type User = Partial<InferModel<typeof users>>;


export const getUserById = async (id : string) => { 

    try { 
        const user = await db.select().from(users).where(eq(users.id ,id)).limit(1);
        

        return user[0]
    } catch { 
        return null
    }
    
}

export const getUserByEmail = async (email : string) => { 

    try { 
        const user = await db.select().from(users).where(eq(users.email ,email)).limit(1);

        return user[0]
    } catch { 
        return null
    }
    
}
export const getUserByUsername = async (username : string) => { 

    try { 
        const user = await db.select().from(users).where(eq(users.username ,username)).limit(1);

        return user[0]
    } catch { 
        return null
    }
    
}


export const updateUserById = async (id : string, options :  User) => { 
    try { 
        const user = await db.update( users).set({
            ...options
        }).where(eq(users.id, id)).returning()


        


       

        return user[0]
    } catch { 
        return null
    }
}

export const updateUserByEmail = async (email : string, options :  User) => { 
    try { 
        const res = await db.update( users).set({
            ...options
        }).where(eq(users.email, email)).returning()


        


       

        return res[0]
    } catch { 
        return null
    }
}



export const createUser = async (email : string , options : User) => { 
    try { 
        const user = await db.insert(users).values({ 
            email , 
            ...options
        })

        return user
    } catch { 
        return null
    }
}

export const decrementProjectsLeft = async (id : string) =>  { 
    try { 

        const prevUser = await getUserById(id)
        if (!prevUser) { 
            return null
        }

        const user = await db.update( users).set({
            projectsLeft :prevUser?.projectsLeft - 1
        }).where(eq(users.id, id)).returning()


       

        return user[0]
    } catch { 
        return null
    }
}

