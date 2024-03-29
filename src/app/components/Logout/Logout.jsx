'use client'
import React from 'react'
import { deleteCookie } from 'cookies-next'
import { Button, Typography, Box } from '@mui/material'
import { useRouter } from 'next/navigation'

function Logout () {
  const router = useRouter()

  const deleteToken = () => {
      deleteCookie('token')
      router.refresh()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        mt: 5
      }}
    >
      <Typography> Вітаю в системі!</Typography>
      <Button onClick={deleteToken} variant='outlined'>
        Вийти
      </Button>
    </Box>
  )
}

export default Logout
