'use client'
import Image from "next/image";
import { FormEvent, useState } from "react";
import axios from 'axios'
import { BASE_URL } from "@/constants/BackendURL";

export default function Home() {

  const [userName,setUserName] = useState('')
  const [password,setPassword] = useState('')

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()

    const data = {
      userName:userName,
      password:password
    }

    await axios.post(`${BASE_URL}/user/login`,data)
    .then(response=>console.log("Response: ",response))
    .catch(error=>console.log("Error while requesting the login url: ",error)
    )

  }
  return <div className='bg-blue-900'>Login page</div>;
}
