import React from 'react'
import AddNewGoodForm from '@/app/components/goods/AddNewGoodForm/AddNewGoodForm'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import fetchColors from '@/app/API/fetchColors'
import fetchColorSchemes from '@/app/API/fetchColorSchemes'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Нова сіточка'
}

async function addNewGood () {
  const colors = await fetchColors()
  const colorSchemes = await fetchColorSchemes()
  return (
    <>
      <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap' }}>
        <Link href='/goods'>
          <Typography color='primary' sx={{ '&:hover': { color: '#2c387e' } }}>
            Сіточки
          </Typography>
        </Link>
        <Typography>
          {' '}
          <KeyboardArrowRightOutlinedIcon />{' '}
        </Typography>
        <Typography color='grey'> Нова сіточка </Typography>
      </Box>

      <AddNewGoodForm url={url} colors={colors} colorSchemes={colorSchemes} />
    </>
  )
}

export default addNewGood
