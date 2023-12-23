import React from 'react'
import AddOrderForm from '@/app/components/orders/AddOrderForm/AddOrderForm'
import Button from '@mui/material/Button'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Link from 'next/link'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Нове замовлення',
};


function addNewOrder () {
  return (
    <>
    <Link href='/orders'> <Button sx={{gap: 1, mb: 1 }}> <ArrowBackOutlinedIcon/> До замовлень </Button></Link>
    <AddOrderForm url={url}/>
    </>
  )
}

export default addNewOrder
