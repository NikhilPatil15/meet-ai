'use client'
import React,{useEffect,useState}from "react"
import axios from 'axios'
import Box from '@mui/material/Box'

export default function MeetingHistory(){
    const [meetings , setMeetings] = useState([])

    const fetchMeetingsHistory = async()=>{
        try {
            
        } catch (error) {
            console.error("Error Fetching meeting History")
            
        }
    }
    return(
        <div>
            This is meeting history page
        </div>
    )
}