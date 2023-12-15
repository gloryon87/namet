import React from 'react'
import Order from '../components/Order/Order'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Box from '@mui/material/Box'
import SelectComponent from '../components/Select/Select'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab';

const url = process.env.REACT_APP_SERVER_URL || ''

async function getData(params) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`${url}/api/orders?${queryParams}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    const clonedResponse = res.clone();
    const jsonData = await clonedResponse.json();
    return jsonData;
  } catch (error) {
    throw new Error('Не вдалось отримати дані');
  }
}


async function Orders ({ searchParams }) {
  const data = await getData(searchParams)
  console.log(data);

  const goodsArray = data?.flatMap(order => order.goods)
  const goodsAreasArray = goodsArray?.map(good => good.a*good.b*good.qty) || []
  const goodsQtyArray = goodsArray?.map(good => good.qty) || []
  const goodsQty = goodsQtyArray.reduce((total, num) => total + num, 0);
  const goodsArea = goodsAreasArray.reduce((total, num) => total + num, 0);


  return (
    <Box sx={{ml: 1, mr: 1}}>
      <Box sx={{display: 'flex', ml: 1, mb: 3, gap: 2}}><SelectComponent /></Box>
      <Typography color='primary' sx={{ml: 1, mb: 2 }}>
        Загальна площа сіток: <strong>{goodsArea} м.кв.</strong> Загальна кількість сіток: <strong>{goodsQty} од.</strong>
      </Typography>
      <Box sx={{ml: 1, color: '#424242' }}>
        <Box sx={{ position: 'relative' }}>
          <Link href='/orders/addNewOrder'>
            <Fab
              sx={{ position: 'fixed', textTransform: 'none', opacity: '90%', right: { xs: 20, sm: 30, xl: '5%' }, bottom: { xs: 20, sm: 30, lg: 35 } }}
              color='primary' aria-label="Додати новий пост" variant='extended'> 
              {/* <AddIcon />  */}
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
    </Box>
  )
}

export default Orders
