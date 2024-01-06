import React from 'react'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Button from '@mui/material/Button'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Good from '../../orders/Good/Good'
import Tooltip from '@mui/material/Tooltip'
import { format } from 'date-fns'
import calculateGoodsData from '@/app/utils/calculateGoodsData'
import calculateMaterialsData from '@/app/utils/calculateMaterialsData'
import MoveToWarehouse from '../MoveToWarehouse/MoveToWarehouse'

const tableStyle = {
  display: 'flex',
  gap: 1,
  border: '1px solid lightgrey'
}

const url = process.env.REACT_APP_SERVER_URL || ''

function SingleProduction ({ production }) {
  const {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea,
    goodsColor
  } = calculateGoodsData(production.goods)

  const materialDifferenceArray = calculateMaterialsData(
    production.materials,
    goodsColor
  )

  return (
    <>
      <Link href='/production'>
        {' '}
        <Button sx={{ gap: 1, mb: 1 }}>
          {' '}
          <ArrowBackOutlinedIcon /> До списку виробників{' '}
        </Button>
      </Link>
      <Typography variant='h6' sx={{ mb: 1 }}>
        {production.name}
      </Typography>
      <Grid container spacing={1} sx={{ m: 0, border: 1, width: 'auto' }}>
        <Grid item xs={4} lg={2} sx={tableStyle}>
          <Typography>Контакти </Typography>
        </Grid>
        <Grid item xs={8} lg={10} sx={tableStyle}>
          <Typography> {production.contacts}. </Typography>
        </Grid>
        <Grid item xs={4} lg={2} sx={tableStyle}>
          <Typography>Матеріали </Typography>
        </Grid>
        <Grid item xs={8} lg={10} sx={tableStyle}>
          {production.materials.map(material => (
            <Typography key={material._id}>
              {material.material} {material.color}: {material.qty} м²,
            </Typography>
          ))}
        </Grid>
      </Grid>
      <Typography sx={{ mt: 2, mb: 1 }}>Товари:</Typography>
      {production.goods?.map(good => (
        <Grid
          container
          spacing={1}
          key={good._id}
          sx={{
            m: 0,
            width: 'auto',
            mb: 1,
            border: 1
          }}
        >
          <Grid item xs={12} md={9} sx={{ ...tableStyle, pr: 1 }}>
            <Tooltip title={good.orderContacts}>
              <Link href={`/orders/${good.orderId}`}>
                <Good good={good} />
              </Link>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2} sx={tableStyle}>
            <Typography align='center'>
              {format(new Date(good.date), 'dd.MM.yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={6} md={1} sx={tableStyle}>
            <MoveToWarehouse good={good} url={url} production={production} />
          </Grid>
        </Grid>
      ))}
      <Box
        border={1}
        borderRadius={2}
        sx={{ p: 2, mt: 3, boxShadow: 2, width: 'max-content' }}
      >
        <Typography color='primary'>
          Загальна площа: <strong>{goodsArea} м²</strong> <br /> Загальна
          кількість сіточок: <strong>{goodsQty} шт.</strong> <br /> Видано:{' '}
          <strong>
            {goodsDelivered} шт. ({goodsDeliveredArea} м²)
          </strong>
        </Typography>
        <Typography color='primary' sx={{ mt: 3 }}>
          Витрати матеріалів:
        </Typography>
        {
  goodsColor.map((color, index) =>
    color.colorArea > 0 ? (
      <Typography key={index}>
        {color.name}: {color.colorArea} м²
      </Typography>
    ) : null
  )
}
        <Typography color='primary' sx={{ mt: 3 }}>
          Залишки матеріалів:
        </Typography>
        {materialDifferenceArray.map((material, index) => (
          <Typography
            color={material.difference > 0 ? null : 'error'}
            key={index}
          >
            {material.color}: {material.difference} м²
          </Typography>
        ))}
      </Box>
    </>
  )
}

export default SingleProduction
