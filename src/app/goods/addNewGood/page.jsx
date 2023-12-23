import React from 'react'
import AddNewGoodForm from '@/app/components/goods/AddNewGoodForm/AddNewGoodForm'
import Button from '@mui/material/Button'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Link from 'next/link'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Нова сіточка',
};


function addNewGood() {
  return (
    <>
    <Link href='/goods'> <Button sx={{gap: 1, mb: 1 }}> <ArrowBackOutlinedIcon/> До сіточок </Button></Link>
    <AddNewGoodForm url={url}/>
    </>
    )
}

export default addNewGood