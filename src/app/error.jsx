'use client'
import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'


function error({ error }) {
  const router = useRouter()

  useEffect(() => {
  console.error(error)
  if (error.message === 'Помилка валідації') {
    setTimeout(() => {
      router.push('/'); return
    }, 1000);
  }
}, [error])


  return (
        <Typography sx={{color: 'red', textAlign: 'center'}}>Помилка! { error.message || 'щось пішло не так'}</Typography>
  )
}

export default error