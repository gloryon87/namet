import React from 'react'
import { format } from 'date-fns'
import Good from '../Good/Good'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import OrderControlBar from '../OrderControlBar/OrderControlBar'
import GoodEditComponent from '../GoodEditComponent/GoodEditComponent'
import GoodDeleteComponent from '../GoodDeleteComponent/GoodDeleteComponent'
import GoodsAddComponent from '../GoodsAddComponent/GoodsAddComponent'
import GoodDeliverComponent from '../GoodDeliverComponent/GoodDeliverComponent'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import calculateGoodsData from '@/app/utils/calculateGoodsData'
import GoodProductionComponent from '../GoodProductionComponent/GoodProductionComponent'
import fetchProductionsList from '@/app/API/fetchProductionsList'
import fetchColors from '@/app/API/fetchColors'
import fetchColorSchemes from '@/app/API/fetchColorSchemes'

const url = process.env.REACT_APP_SERVER_URL || ''
const gridItemStyle = { border: '1px solid lightgrey' }

async function SingleOrder({ order }) {
  const colors = await fetchColors()
  const colorSchemes = await fetchColorSchemes()
  const productions = await fetchProductionsList()
  const formatedDate = format(Date.parse(order?.date), 'dd.MM.yyyy HH:mm')
  const formatedDeadline = order.deadline
    ? format(Date.parse(order.deadline), 'dd.MM.yyyy')
    : ''

  // розрахунок загальної площі та кількості сіток в замовленні
  const {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea,
    goodsColor
  } = calculateGoodsData(order.goods)

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
        <Typography color='grey'> Замовлення № {order._id} </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          {' '}
          {`Замовлення № ${order._id}`}{' '}
        </Typography>
        <OrderControlBar order={order} url={url} />
      </Box>
      <Grid
        container
        spacing={1}
        border={1}
        sx={{ ml: 0, width: 'auto', mb: 2, fontWeight: 400 }}
      >
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Дата замовлення
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{formatedDate}</Typography>
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Пріоритет
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{order?.priority}</Typography>
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Замовник
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{order?.contacts}</Typography>
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Коментар
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{order?.info || '-'}</Typography>
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Стан
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{order?.state}</Typography>
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Дедлайн
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          <Typography>{formatedDeadline || '-'}</Typography>
        </Grid>
      </Grid>
      <Typography sx={{ mt: 2, mb: 1 }}>Товари:</Typography>
      {order?.goods?.map(good => (
        <Box
          key={good._id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            mb: 1,
            border: '1px solid lightgrey'
          }}
        >
          <Good good={good} />
          <Box
            sx={{
              display: 'flex',
              flexWrap: { xs: 'wrap', md: 'nowrap'},
              ml: 'auto',
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '120px', ml: 'auto' }}>
              {good.production && (
                <Link target='_blank' href={`/production/${good.production}`}>
                  <Typography
                    color='primary'
                    sx={{ pl: 1, '&:hover': { color: '#2c387e' } }}
                  >
                    {good.production}
                  </Typography>
                </Link>
              )}
            </Box>

            <Box sx={{display: 'flex', ml: 'auto'}}>
              <GoodProductionComponent
                orderId={order._id}
                orderContacts={order.contacts}
                good={good}
                goodId={good._id}
                url={url}
                productions={productions}
              />
              <GoodDeliverComponent
                orderId={order._id}
                orderContacts={order.contacts}
                good={good}
                goodId={good._id}
                url={url}
              />
              <GoodEditComponent
                orderId={order._id}
                good={good}
                goodId={good._id}
                url={url}
                colors={colors}
                colorSchemes={colorSchemes}
              />
              <GoodDeleteComponent
                orderId={order._id}
                goodId={good._id}
                url={url}
              />
            </Box>
          </Box>
        </Box>
      ))}
      <GoodsAddComponent orderId={order._id} url={url} colors={colors} colorSchemes={colorSchemes} />
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        <Box
          border={1}
          borderRadius={2}
          sx={{ p: 2, boxShadow: 2, width: 'max-content' }}
        >
          <Typography color='primary'>
            Загальна площа: <strong>{goodsArea} м²</strong> <br /> Загальна
            кількість сіточок: <strong>{goodsQty} шт.</strong> <br /> Видано:{' '}
            <strong>
              {goodsDelivered} шт. ({goodsDeliveredArea} м²)
            </strong>
          </Typography>
        </Box>
        <Box
          border={1}
          borderRadius={2}
          sx={{ p: 2, boxShadow: 2, width: 'max-content' }}
        >
          <Typography color='primary'>Потреби в матеріалах:</Typography>
          {goodsColor?.map((color, index) => (
            <Typography key={index}>
              {color.name}: {color.colorArea} м²
            </Typography>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default SingleOrder
