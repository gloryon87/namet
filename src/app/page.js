import React from 'react'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import validateToken from './API/validateToken'
import { metadata } from './layout'

const url = process.env.REACT_APP_SERVER_URL || ''

metadata = {
  title: 'Намет',
  description: 'Намет "Все для перемоги!"'
}

export default async function Home() {
  const tokenIsValid = await validateToken()
  
  if (tokenIsValid) {
    return (
      <Logout url={url} />
    )
  }
  else {
    return (
      <Login url={url} />
    )
  }
}
