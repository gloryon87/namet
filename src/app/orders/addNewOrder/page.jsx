import React from 'react'
import AddOrderForm from '@/app/components/AddOrderForm/AddOrderForm'
import Button from '@mui/material/Button'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Link from 'next/link'

const url = process.env.REACT_APP_SERVER_URL || ''

function addNewOrder () {
  return (
    <>
    <Link href='/orders'> <Button sx={{gap: 1, mb: 1 }}> <ArrowBackOutlinedIcon/> Назад до замовлень </Button></Link>
    <AddOrderForm url={url}/>
    </>
  )
}

export default addNewOrder
