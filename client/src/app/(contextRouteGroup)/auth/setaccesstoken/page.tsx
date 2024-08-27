'use client'

import { useUserContext } from "@/Context/userContext"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const setAccessToken = () => {
  const {token, setToken}  = useUserContext()
  const router = useRouter()

  useEffect(()=>{
   async function fetchAccessToken(){
    const response = await axios.get('http://localhost:5000/api/v1/user/set-access-token',{
      withCredentials:true
    })


    console.log("Response: ", response.data.data);
    const accessToken = response.data.data
    setToken(accessToken)
    router.push('/user/dashboard')
   }  

   fetchAccessToken()
    
  },[])

  return (
    null
  )
}

export default setAccessToken