import React, { Suspense } from 'react'
import Order from '../components/orders/Order/Order'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SelectComponent from '../components/orders/Select/Select'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import calculateGoodsData from '@/app/utils/calculateGoodsData'
import { fetchParamsServer } from '@/app/API/fetchParamsServer'
import resHandler from '../API/resHandler'
import { redirect } from 'next/navigation'


const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Замовлення'
}

async function getData (params) {
  const fetchParams = fetchParamsServer()
  try {
    const queryParams = new URLSearchParams(params).toString()
    const res = await fetch(`${url}/api/orders?${queryParams}`, fetchParams)
    return await resHandler(res)
  } catch (error) {
    if (error.message === 'Помилка валідації') {
      redirect('/')
    }
    throw new Error(error.message)
  }
}

async function Orders ({ searchParams }) {
  const data = await getData(searchParams)
  const isAllOrders = searchParams.all === 'true' || data.length < 11 


  const goodsArray = data?.flatMap(order => order.goods)
  const { goodsQty, goodsArea, goodsDelivered, goodsDeliveredArea } =
    calculateGoodsData(goodsArray)

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Замовлення
      </Typography>
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <Suspense
          fallback={
            <Typography color='primary'>завантажується пошук...</Typography>
          }
        >
          <SelectComponent />
        </Suspense>
      </Box>
      {isAllOrders ? (
        <Typography color='primary' sx={{ ml: 1, mb: 2 }}>
          Загальна площа всіх замовлень: <strong>{goodsArea} м²</strong>.
          Загальна кількість сіточок: <strong>{goodsQty} шт.</strong> Видано:{' '}
          <strong>
            {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
          </strong>
        </Typography>
      ) : (
        <Link href='/orders?all=true' scroll={false}>
          <Button color='primary' sx={{ mb: 1 }}>
            показати всі замовлення
          </Button>
        </Link>
      )}
      {/* <Box> */}
      <Box sx={{ position: 'relative' }}>
        <Link href='/orders/addNewOrder'>
          <Fab
            sx={{
              position: 'fixed',
              textTransform: 'none',
              opacity: '90%',
              right: { xs: 20, sm: 30, xl: '5%' },
              bottom: { xs: 20, sm: 30, lg: 35 }
            }}
            color='primary'
            aria-label='Додати новий пост'
            variant='extended'
          >
            Нове замовлення
          </Fab>
        </Link>
      </Box>
      {/* <Grid
          container
          spacing={1}
          sx={{
            m: 0,
            width: 'auto',
            border: 1,
            position: 'sticky',
            top: 0,
            backgroundColor: 'white'
          }}
        >
          <Grid item xs={6} sm={3} md={2} sx={{ border: 1 }}>
            Дата замовлення
          </Grid> */}
      {/* <Box
            component={Grid}
            item
            md={1}
            sx={{ border: 1 }}
            display={{ xs: 'none', md: 'block' }}
          >
            Пріор.
          </Box> */}
      {/* <Grid item xs={6} sm={6} md={3} sx={{ border: 1 }}>
            Замовник
          </Grid>
          <Box
            component={Grid}
            item
            md={5}
            sx={{ border: 1 }}
            display={{ xs: 'none', md: 'block' }}
          >
            Коментар
          </Box> */}
      {/* <Box
            component={Grid}
            item
            sm={2}
            md={1}
            sx={{ border: 1 }}
            display={{ xs: 'none', sm: 'block' }}
          >
            Стан
          </Box> */}
      {/* <Box
            component={Grid}
            item
            sm={3}
            md={2}
            sx={{ border: 1 }}
            display={{ xs: 'none', sm: 'block' }}
          >
            Дедлайн
          </Box>
        </Grid> */}
      <Box component='ol' sx={{ border: 1 }}>
        {data &&
          data.map(order => (
            <li style={{ fontSize: 13 }} key={order._id}>
              <Link href={`/orders/${order._id}`}>
                <Order order={order} />
              </Link>
            </li>
          ))}
      </Box>
      {/* </Box> */}
      {!isAllOrders && (
        <Box sx={{ textAlign: 'center' }}>
          <Link href='/orders?all=true' scroll={false}>
            <Button color='primary' sx={{ mt: 2 }}>
              показати всі замовлення
            </Button>
          </Link>
        </Box>
      )}
    </>
  )
}

export default Orders
