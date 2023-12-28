import React, { Suspense } from 'react'
import Order from '../components/orders/Order/Order'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SelectComponent from '../components/orders/Select/Select'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab';
import calculateGoodsData from '@/app/utils/calculateGoodsData'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Замовлення',
};

async function getData(params) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`${url}/api/orders?${queryParams}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    if (res.ok) {
    const clonedResponse = res.clone();
    const jsonData = await clonedResponse.json();
    return jsonData;
  } else {
    throw new Error('Помилка сервера');
  }

  } catch (error) {
    throw new Error('Не вдалось отримати дані');
  }
}


async function Orders ({ searchParams }) {
  const data = await getData(searchParams)

  const goodsArray = data?.flatMap(order => order.goods)
  const { goodsQty, goodsArea, goodsDelivered, goodsDeliveredArea } = calculateGoodsData(goodsArray)

//   const goodsAreasArray = goodsArray?.map(good => good.goodArea) ?? []
//   const goodsQtyArray = goodsArray?.map(good => good.qty) ?? []
//   const goodsQty = goodsQtyArray.reduce((total, num) => total + num, 0);
//   const goodsArea = goodsAreasArray.reduce((total, num) => total + num, 0);
//   const goodsDeliveredArray = goodsArray?.map(good => good.delivered) ?? []
//   const goodsDelivered = goodsDeliveredArray.reduce(
//       (total, num) => total + (num ?? 0),
//       0
//     )
//   const goodsDeliveredAreaArray = goodsArray?.map(good => (good.delivered ?? 0) * (good.a * good.b ?? 0)) ?? [];
//   const goodsDeliveredArea = goodsDeliveredAreaArray.reduce(
//   (total, num) => total + (num ?? 0),
//   0
// );


  return (
    <Box sx={{ mx: 2 }}>
      <Typography variant='h5' sx={{ml: 1}}gutterBottom>Замовлення</Typography>
      <Box sx={{display: 'flex', ml: 1, mb: 3, gap: 2}}><Suspense fallback={<Typography color='primary'>завантажується пошук...</Typography>}><SelectComponent /></Suspense></Box>
      {Object.keys(searchParams).length !== 0 && <Typography color='primary' sx={{ml: 1, mb: 2 }}>
        Загальна площа всіх замовлень: <strong>{goodsArea} м²</strong>. Загальна кількість сіточок: <strong>{goodsQty} шт.</strong> Видано: <strong>{goodsDelivered} шт. ({goodsDeliveredArea} м²) </strong>
      </Typography>}
      <Box sx={{ml: 1, color: '#424242' }}>
        <Box sx={{ position: 'relative' }}>
          <Link href='/orders/addNewOrder'>
            <Fab
              sx={{ position: 'fixed', textTransform: 'none', opacity: '90%', right: { xs: 20, sm: 30, xl: '5%' }, bottom: { xs: 20, sm: 30, lg: 35 } }}
              color='primary' aria-label="Додати новий пост" variant='extended'> 
              Нове замовлення</Fab></Link>
      </Box>
        <Grid
          container
          spacing={1}
          sx={{
            m: 0,
            width: '100%',
            border: 1,
            position: 'sticky',
            top: 0,
            backgroundColor: 'white'
          }}
        >
          <Grid item xs={6} sm={3} md={2} sx={{ border: 1 }}>
            Дата замовлення
          </Grid>
          <Box
            component={Grid}
            item
            md={1}
            lg={1}
            sx={{ border: 1 }}
            display={{ xs: 'none', md: 'block' }}
          >
            Пріор.
          </Box>
          <Grid item xs={6} sm={4} md={3} sx={{ border: 1 }}>
            Замовник
          </Grid>
          <Box
            component={Grid}
            item
            md={3}
            sx={{ border: 1 }}
            display={{ xs: 'none', md: 'block' }}
          >
            Коментар
          </Box>
          <Box
            component={Grid}
            item
            sm={2}
            md={1}
            sx={{ border: 1 }}
            display={{ xs: 'none', sm: 'block' }}
          >
            Стан
          </Box>
          <Box
            component={Grid}
            item
            sm={3}
            md={2}
            sx={{ border: 1 }}
            display={{ xs: 'none', sm: 'block' }}
          >
            Дедлайн
          </Box>
        </Grid>
        <ol>
          {data &&
            data.map(order => (
              <li style={{fontSize: 13}} key={order._id}>
                <Link href={`/orders/${order._id}`}>
                  <Order order={order} />
                </Link>
              </li>
            ))}
        </ol>
      </Box>
      {Object.keys(searchParams).length === 0 && <Box sx={{textAlign: 'center'}}><Link href='/orders?all=true'><Button color='primary' sx={{mt: 2}}>показати всі замовлення</Button></Link></Box>}
    </Box>
  )
}

export default Orders
