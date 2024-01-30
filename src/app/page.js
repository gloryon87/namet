import React from 'react'
import Login from './components/Login/Login'

const url = process.env.REACT_APP_SERVER_URL || ''


export default function Home() {
  return (
      <Login url={url}/>
  )
}
