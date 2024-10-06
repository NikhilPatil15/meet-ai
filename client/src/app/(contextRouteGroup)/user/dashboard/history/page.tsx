'use client'
import React,{useEffect,useState}from "react"
import axios from 'axios'
import Box from '@mui/material/Box'
import MeetingCard from "@/components/DashBoard/meetingCard"
import { Card } from "@mui/material"

export default function MeetingHistory(){
    const [meetings , setMeetings] = useState([])

    const fetchMeetingsHistory = async()=>{
        try {
                const response = await axios.get('http://localhost:5000/api/v1/user/get-meeting-history')
                setMeetings(response.data)

        } catch (error) {
            console.error("Error Fetching meeting History")
            
        }
    }

    useEffect(()=>{
        fetchMeetingsHistory();
    },[])
    return(
        <div>
            <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <>

        </>
      ))}
    </Box>
        </div>
    )
}