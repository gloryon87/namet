'use client'
import React from 'react'
import Typography from '@mui/material/Typography';

function error({ error }) {
  console.error(error)

  return (
        <Typography sx={{color: 'red', textAlign: 'center'}}>Помилка! { error.message || 'щось пішло не так'}</Typography>
  )
}

export default error