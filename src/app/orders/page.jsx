import React from 'react'
import Order from '../components/Order/Order'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Box from '@mui/material/Box'
import SelectComponent from '../components/Select/Select'
import Typography from '@mui/material/Typography'


const url = process.env.REACT_APP_SERVER_URL || ''

async function getData () {
  try {
    const res = await fetch(`${url}/api/orders`, { next: { revalidate: 0 } })
    const clonedResponse = res.clone();
    const jsonData = await clonedResponse.json();
    return jsonData;
  } catch (error) {
    throw new Error('Не вдалось отримати дані')
  }
}

async function Orders () {
  const data  = await getData()

  // const postOne =  {
  //     _id: '653e0d33d0f58f26573f91cc',
  //     contacts: '0989880990 Slava',
  //     goods: [
  //       {
  //         _id: '653e0d33d0f58f26573f91cb',
  //         a: 4,
  //         b: 6,
  //         qty: 10,
  //         season: 'осінь',
  //         material: 'спанбонд',
  //         color: [{ беж10: 2 }, { олива: 2 }, { коричневий: 1 }],
  //         production: 'Коротич'
  //       }
  //     ],
  //     date: '2023-10-27T18:20:58.000Z',
  //     info: 'string',
  //     state: 'в роб.',
  //     priority: 'вис.',
  //     deadline: '2023-12-27T18:20:58.000Z'
  //   }

  // const postTwo = {
  //     _id: '653e0d33d0f58f26573f91cf',
  //     contacts: '0989880990 Slava',
  //     goods: [
  //       {
  //         _id: '653e0d33d0f58f26573f91cy',
  //         a: 4,
  //         b: 6,
  //         qty: 10,
  //         season: 'осінь',
  //         material: 'спанбонд',
  //         color: [{ беж10: 2 }, { олива: 2 }, { коричневий: 1 }],
  //         production: 'Коротич'
  //       },
  //       {
  //         _id: '653e0d33d0f58f26573f91co',
  //         a: 4,
  //         b: 8,
  //         qty: 5,
  //         season: 'осінь',
  //         material: 'спанбонд',
  //         color: [{ беж10: 2 }, { олива: 2 }, { коричневий: 1 }],
  //         production: 'Коротич'
  //       }
  //     ],
  //     date: '2023-10-27T18:20:58.000Z',
  //     info: 'string',
  //     state: 'в роб.',
  //     priority: 'вис.',
  //     deadline: '2023-12-27T18:20:58.000Z'
  //   }

  // const data = [ postOne, postOne, postTwo, postTwo, postOne, postTwo ]

  const goodsArray = data?.flatMap(order => order.goods)
  const goodsAreasArray = goodsArray?.map(good => good.a*good.b*good.qty)
  const goodsQtyArray = goodsArray?.map(good => good.qty)
  const goodsQty = goodsQtyArray.reduce((total, num) => total + num)
  const goodsArea = goodsAreasArray.reduce((total, num) => total + num)

  return (
    <>
      <Box sx={{display: 'flex', ml: 1, mb: 1, gap: 2}}><SelectComponent /></Box>
      <Typography sx={{ml: 1, color: '#3f51b5'}}>Загальна площа сіток: <strong>{goodsArea} м.кв.</strong> Загальна кількість сіток: <strong>{goodsQty} од.</strong></Typography>
      <Box sx={{ml: 1, color: '#424242' }}>
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
            Інфо
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
              <li key={order._id}>
                <Link href={`/orders/${order._id}`}>
                  <Order order={order} />
                </Link>
              </li>
            ))}
        </ol>
      </Box>
    </>
  )
}

export default Orders
