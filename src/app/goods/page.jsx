import React, { Suspense } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import GoodsSearch from '../components/goods/GoodsSearch/GoodsSearch'
import GoodItem from '../components/goods/GoodItem/GoodItem'
import calculateGoodsData from '@/app/utils/calculateGoodsData'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Сіточки',
};

async function getData(params) {
try {
  const queryParams = new URLSearchParams(params).toString();
  const res = await fetch(`${url}/api/goods?${queryParams}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store',
    },
  });

  if (res.ok) {
    const jsonData = await res.json();
    return jsonData;
  } else {
    throw new Error('Помилка сервера');
  }
} catch (error) {
  throw new Error('Не вдалось отримати дані');
}
}

export default async function Goods({ searchParams }) {
  const goods = await getData(searchParams)
  const { goodsQty, goodsArea } = calculateGoodsData(goods)
  console.log(goods)

  return (
    <>
    <Box sx={{ position: 'relative', backgroundColor: 'white' }}>
          <Link href='/goods/addNewGood'>
            <Fab
              sx={{ position: 'fixed', textTransform: 'none', opacity: '90%', right: { xs: 20, sm: 30, xl: '5%' }, bottom: { xs: 20, sm: 30, lg: 35 } }}
              color='primary' aria-label="Додати новий пост" variant='extended'> 
              Нова сіточка</Fab></Link>
      </Box>
      <Box sx={{ mb: 11 }}>
        <Typography variant='h5' gutterBottom>Склад сіточок</Typography>
        <Suspense fallback={<Typography color='primary'>завантажується пошук...</Typography>}><GoodsSearch/></Suspense>
        <Typography color='primary' sx={{display: 'flex', mt: 3, mb: 2, gap: 1}}> <span>Загальна площа сіточок: <strong>{goodsArea} м²</strong> </span> <span> Загальна кількість сіточок: <strong>{goodsQty} шт.</strong> </span></Typography>
        <Grid container spacing={1} sx={{border: 1, position: 'sticky', top: 0, backgroundColor: 'white', m: 0}}>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Розмір
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1}}>
            Кіл-ть
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1}}>
            Сезон
          </Grid>
          <Grid item md={2} display={{ xs: 'none', md: 'block' }} sx={{border: 1}}>
            Матеріал
          </Grid>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Площа
          </Grid>
          <Grid item md={5} sx={{border: 1}} display={{ xs: 'none', md: 'block' }}>
            Кольори
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1, zIndex: 2000}}> </Grid>
        </Grid>
      <ol>
          {goods && goods.length > 0 && goods.map(good => <GoodItem good={good} key={good._id}/>)}
      </ol>
      </Box>
    </>
  )
}