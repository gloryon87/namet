import React from 'react'
import AddOrderForm from '@/app/components/orders/AddOrderForm/AddOrderForm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import Link from 'next/link'
import fetchColors from '@/app/API/fetchColors'
import fetchColorSchemes from '@/app/API/fetchColorSchemes'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Нове замовлення'
}

async function addNewOrder() {
  const colors = await fetchColors()
  const colorSchemes = await fetchColorSchemes()

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap' }}>
        <Link href='/orders'>
          <Typography color='primary' sx={{ '&:hover': { color: '#2c387e' } }}>
            Всі замовлення
          </Typography>
        </Link>
        <Typography>
          {' '}
          <KeyboardArrowRightOutlinedIcon />{' '}
        </Typography>
        <Typography color='grey'> Додати нове замовлення </Typography>
      </Box>

      <AddOrderForm url={url} colors={colors} colorSchemes={colorSchemes} />
    </>
  )
}

export default addNewOrder
