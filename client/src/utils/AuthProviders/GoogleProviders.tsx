"use client"
import React from 'react'
import PropTypes from 'prop-types'
import { SessionProvider } from 'next-auth/react'

interface Props {
    children     : React.ReactNode
}

const GoogleProviders = (props : Props )=> {
  return (
    <SessionProvider>
        {
            props.children
        }
    </SessionProvider>
  )
}


export default GoogleProviders