import React from 'react'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import validateToken from './API/validateToken'

const url = process.env.REACT_APP_SERVER_URL || ''

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
