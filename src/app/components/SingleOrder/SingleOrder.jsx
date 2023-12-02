import React from 'react'
import { format } from 'date-fns'
import Good from '../Good/Good'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import OrderControlBar from '../OrderControlBar/OrderControlBar'
import GoodsEditComponent from '../GoodsEditComponent/GoodsEditComponent'
import GoodDeleteComponent from '../GoodDeleteComponent/GoodDeleteComponent'
import GoodsAddComponent from '../GoodsAddComponent/GoodsAddComponent'

const url = process.env.REACT_APP_SERVER_URL || ''
const gridItemStyle = { border: '1px solid lightgrey' }

function SingleOrder({ order }) {
  console.log(order);
  const formatedDate = format(Date.parse(order?.date), 'dd. MM. yyyy')
  const formatedDeadline = format(Date.parse(order?.deadline), 'dd. MM. yyyy')

  // розрахунок загальної площі та кількості сіток в замовленні
  const goodsAreasArray = order.goods?.map(good => good.goodArea)
  const goodsQtyArray = order.goods?.map(good => good.qty)
  let goodsQty = 0
  if (goodsAreasArray.length > 0) { goodsQty = goodsQtyArray.reduce((total, num) => total + num) }
  let goodsArea = 0
  if (goodsQtyArray.length > 0) { goodsArea = goodsAreasArray.reduce((total, num) => total + num) }

  // розрахунок співвідношення кольорів в замовленні
  const goodsColorArray = order.goods?.flatMap(good => {
  return good.color?.map(color => ({
    name: color.name,
    colorArea: color.colorArea
  }));
});
  const goodsColor = goodsColorArray.reduce((acc, current) => {
    const existingItem = acc.find(item => item.name === current.name)

    if (existingItem) {
      existingItem.colorArea += current.colorArea
    } else {
      acc.push({ name: current.name, colorArea: current.colorArea })
    }

    return acc
  }, [])

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{ border: '1px solid lightgrey', ml: 0, width: 'auto', mb: 2 }}
      >
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          {' '}
          Дата замовлення
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {formatedDate}
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Пріоритет
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {order?.priority}
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Замовник
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {order?.contacts}
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Інформація
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {order?.info}
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Стан
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {order?.state}
        </Grid>
        <Grid item xs={4} md={2} sx={gridItemStyle}>
          Дедлайн
        </Grid>
        <Grid item xs={8} md={10} sx={gridItemStyle}>
          {formatedDeadline}
        </Grid>
      </Grid>
      <OrderControlBar order={order} url={url}/>
      <Typography sx={{mt: 2}}>Товари:</Typography>
      {order?.goods?.map(good => (
        <Box key={good._id} sx={{display: 'flex'}}>
        <Good good={good}></Good>
        <GoodDeleteComponent orderId={order._id} goodId={good._id} url={url}/>
        </Box>
      ))}
      {/* <GoodsEditComponent goods={order.goods} url={url}/> */}
      <GoodsAddComponent orderId={order._id} url={url}/>
      <Typography sx={{ color: '#3f51b5', mt: 1 }}>
        Загальна площа сіток: <strong>{goodsArea} м.кв.</strong> Загальна кількість сіток: <strong>{goodsQty} од.</strong>
      </Typography>
      <Typography sx={{ color: '#3f51b5', mt: 1 }}>Витрати матеріалів:</Typography>
      {goodsColor.map((color, index) => <Typography sx={{color: '#3f51b5'}}key={index}>{color.name}: <strong>{color.colorArea} м.кв.</strong></Typography>)}
    </>
  )
}

export default SingleOrder
