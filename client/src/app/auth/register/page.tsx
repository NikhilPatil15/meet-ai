'use client'
import { FormEvent, useState } from "react";
import axios from 'axios'
import { BASE_URL } from "@/constants/BackendURL";

export default function Home() {
  const [fullName,setFullName] = useState('')
  const [userName,setUserName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  
  const handleSubmit =async (e:FormEvent) => {
    e.preventDefault()

    const data = {
      userName:userName,
      fullName:fullName,
      email:email,
      password:password
    }

   await axios.post(`${BASE_URL}/user/register`,data)
    .then(response => console.log("Response: ", response))
    .catch(error => console.log("Error while requesting to register route: ",error))
    
  }
  return <div>Register Page</div>;
}
