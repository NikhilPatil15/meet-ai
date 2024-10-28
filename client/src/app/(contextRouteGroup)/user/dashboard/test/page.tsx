import MeetingSummary from '@/components/Solution/MeetSummary'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center pt-4 sm:pt-11 pl-5 sm:pl-28 xs:pl-30 md:pl-32 lg:pl-56 min-h-screen px-4 w-full'>
      <MeetingSummary/>
    </div>
  )
}

export default page
