import React from 'react'
import Good from '../Good/Good'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { format } from 'date-fns'
import calculateGoodsData from '@/app/utils/calculateGoodsData'

const gridItemStyle = { border: '1px solid lightgray', borderTop: 0 }

function Order ({ order }) {
  const formatedDate = format(Date.parse(order.date), 'dd.MM.yyyy HH:mm')
  const formatedDeadline = order.deadline
    ? format(Date.parse(order.deadline), 'dd.MM.yyyy')
    : ''

  const { goodsQty, goodsArea, goodsDelivered, goodsDeliveredArea } =
    calculateGoodsData(order.goods)

  return (
    <Box
      sx={[
        { border: 1, boxShadow: 1, fontSize: '1rem' },
        { '&:hover': { backgroundColor: '#eceff1' } }
      ]}
    >
      <Grid container spacing={1} sx={{ m: 0, width: 'auto' }}>
        <Grid item xs={6} sm={3} md={2} sx={gridItemStyle}>
          {formatedDate}
        </Grid>
        {/* <Box
          component={Grid}
          item
          md={1}
          sx={gridItemStyle}
          display={{ xs: 'none', md: 'block' }}
        >
          {order?.priority}
        </Box> */}
        <Grid item xs={6} sm={6} md={3} sx={gridItemStyle}>
          Замовник: {order?.contacts}
        </Grid>
        <Box
          component={Grid}
          item
          md={5}
          sx={gridItemStyle}
          display={{ xs: 'none', md: 'block' }}
        >
          Інфо: {order.info?.slice(0, 150)}
          {order.info?.length > 150 && '...'}
          {!order.info && '---'}
        </Box>
        {/* <Box
          component={Grid}
          item
          sm={2}
          md={1}
          sx={gridItemStyle}
          display={{ xs: 'none', sm: 'block' }}
        >
          {order?.state}
        </Box> */}
        <Box
          component={Grid}
          item
          sm={3}
          md={2}
          sx={gridItemStyle}
          display={{ xs: 'none', sm: 'block' }}
        >
          До: {' '}{formatedDeadline || '---'}
        </Box>
      </Grid>
      <Box>
        {order.goods?.map(good => (
          <Box
            key={good._id}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Good good={good} />
            <Typography sx={{ width: '120px' }}> {good.production} </Typography>
          </Box>
        ))}
        <Typography color='primary' sx={{ ml: 1, mb: 1, mt: 1 }}>
          Загальна площа замовлення: <strong>{goodsArea} м²</strong>. Загальна
          кількість сіточок: <strong>{goodsQty} шт.</strong> Видано:{' '}
          <strong>
            {goodsDelivered} шт. ({goodsDeliveredArea} м²)
          </strong>
        </Typography>
      </Box>
    </Box>
  )
}

export default Order
