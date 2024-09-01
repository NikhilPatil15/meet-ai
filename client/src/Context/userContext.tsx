'use client'

import { createContext, ReactElement, ReactHTMLElement, ReactInstance, ReactNode, useContext, useState } from 'react'

export interface userContextTypes{
    token: string | null,
    setToken:(token:string) => void,
    refreshToken:string | null,
    setRefreshToken:(refreshToken:string) => void
}


const UserContext = createContext<userContextTypes|undefined>(undefined)

export const useUserContext = () => {
    const context = useContext(UserContext)

    if(!context){
        throw new Error("useUserContext must be within the provider")
    }

    return context
}

export const UserContextProvider = ({children}:any)=>{
    const [token,setToken] = useState<string|null>('')
    const [refreshToken, setRefreshToken] = useState<string|null>('')

    console.log("Token: ", token);
    console.log("Refresh token: ", refreshToken);
    
    
    return(
        <UserContext.Provider value={{token,setToken,refreshToken,setRefreshToken}}>{children}</UserContext.Provider>
    )
    
}