import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

function FeaturedTitle() {
  return (
    <div className='mt-10 p-14'>
      {/* <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      /> */}
      <div className='p-2 md:p- relative z-10 w-full text-center'>
         <h1>Be more productive in work , life and productivity for meeting summary. </h1>
        <p className='mt-5 text-base md:text-lg text-neutral-300 max-w-lg mx-auto leading-relaxed '>
          Our meeting Summary tool is your key to being more productive,  Whether at work or in your personal lifr. it helps you stay organized and efficient . ensuring you never forget importatnt details , tasks or deadlines.
        </p>
        
      </div>
    </div>
  )
}

export default FeaturedTitle
