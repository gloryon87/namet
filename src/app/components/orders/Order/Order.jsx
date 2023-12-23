import React from 'react'
import Good from '../Good/Good'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { format } from 'date-fns'

const gridItemStyle = {border: '1px solid lightgray', borderTop: 0 }

function Order({ order }) {
  const formatedDate = format(Date.parse(order.date), 'dd. MM. yyyy HH:mm')
  const formatedDeadline = order.deadline ? format(Date.parse(order.deadline), 'dd. MM. yyyy') : ''
  const goodsAreasArray = order.goods?.map(good => good.goodArea)
  let goodsArea = 0
  if (goodsAreasArray.length > 0) {
    goodsArea = goodsAreasArray.reduce((total, num) => total + num)
  } 
 
  const goodsQtyArray = order.goods?.map(good => good.qty)
  let goodsQty = 0
  if (goodsQtyArray.length > 0) {
    goodsQty = goodsQtyArray.reduce((total, num) => total + num)
  }
  
  return (
    <Box sx={[{ border: 1, boxShadow: 1, fontSize: '1rem' }, { '&:hover': { backgroundColor: '#eceff1' } }]}>
      <Grid container spacing={1} sx={{ m: 0, mb: 1, width: '100%' }}>
        <Grid
          item
          xs={6}
          sm={3}
          md={2}
          sx={gridItemStyle}
        >
          {formatedDate}
        </Grid>
        <Box
          component={Grid}
          item
          md={1}
          lg={1}
          sx={gridItemStyle}
          display={{ xs: 'none', md: 'block' }}
        >
          {order?.priority}
        </Box>
        <Grid item xs={6} sm={4} md={3} sx={gridItemStyle}>
          {order?.contacts}
        </Grid>
        <Box
          component={Grid}
          item
          md={3}
          sx={gridItemStyle}
          display={{ xs: 'none', md: 'block' }}
        >
          {order?.info?.slice(0, 150)}{order?.info?.length > 150 && '...'}
        </Box>
        <Box
          component={Grid}
          item
          sm={2}
          md={1}
          sx={gridItemStyle}
          display={{ xs: 'none', sm: 'block' }}
        >
          {order?.state}
        </Box>
        <Box
          component={Grid}
          item
          sm={3} md={2} sx={gridItemStyle}
          display={{ xs: "none", sm: 'block' }}
        >
          {formatedDeadline}
        </Box>
      </Grid>
      <Box>
        {order.goods?.map(good => (
          <Good key={good._id} good={good}></Good>
        ))}
        <Typography color='primary' sx={{ml: 1, mb: 1, mt: 1}}>Загальна площа замовлення: <strong>{goodsArea} кв.м.</strong> Загальна кількість сіток: <strong>{goodsQty} од.</strong></Typography>
      </Box>
    </Box>
  )
}

export default Order
    