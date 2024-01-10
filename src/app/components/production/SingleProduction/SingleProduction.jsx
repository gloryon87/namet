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
import ProductionGoodDelete from '../ProductionGoodDelete/ProductionGoodDelete'
import ProductionGoodEdit from '../ProductionGoodEdit/ProductionGoodEdit'
import ProductionEdit from '../ProductionEdit/ProductionEdit'

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
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Typography variant='h6' sx={{ alignSelf: 'center' }}>
          {production.name}
        </Typography>
        <ProductionEdit production={production} url={url} />
      </Box>
      <Grid container spacing={1} sx={{ m: 0, border: 1, width: 'auto' }}>
        <Grid item xs={4} lg={2} border={1}>
          <Typography>Контакти </Typography>
        </Grid>
        <Grid item xs={8} lg={10} border={1}>
          <Typography> {production.contacts}. </Typography>
        </Grid>
        <Grid item xs={4} lg={2} border={1}>
          <Typography>Матеріали </Typography>
        </Grid>
        <Grid item xs={8} lg={10} border={1}>
          {production.materials
            .filter(material => material.qty > 0)
            .map(material => (
              <Typography key={material._id}>
                {material.material} {material.color}: {material.qty} м²
              </Typography>
            ))}
        </Grid>
      </Grid>
      <Typography sx={{ mt: 2, mb: 1 }}>Товари:</Typography>
      {production.goods?.map(good => (
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
          {good.orderId ? (
            <Tooltip title={good.orderContacts}>
              <Link style={{ width: '100%' }} href={`/orders/${good.orderId}`}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <Good good={good} />
                </Box>
              </Link>
            </Tooltip>
          ) : (
            <Good good={good} />
          )}

          <Box sx={{ display: 'flex', ml: 'auto', alignItems: 'center' }}>
            <Box sx={{ width: '120px' }}>
              <Typography align='center'>
                {format(new Date(good.date), 'dd.MM.yyyy')}{' '}
              </Typography>
            </Box>
            <MoveToWarehouse
              good={good}
              goodId={good._id}
              url={url}
              production={production}
            />
            <ProductionGoodEdit
              productionId={production._id}
              good={good}
              goodId={good._id}
              url={url}
            />
            <ProductionGoodDelete
              productionId={production._id}
              goodId={good._id}
              url={url}
            />
          </Box>
        </Box>
      ))}
      <Box
        border={1}
        borderRadius={2}
        sx={{
          p: 2,
          mt: 3,
          boxShadow: 2,
          width: 'max-content',
          maxWidth: '100%'
        }}
      >
        <Typography color='primary' sx={{ my: 1 }}>
          Площа сіточок в роботі:{' '}
          <strong>{goodsArea - goodsDeliveredArea} м²</strong>.
          <br />
          Кількість сіточок в роботі:{' '}
          <strong>{goodsQty - goodsDelivered} шт.</strong> <br />
          Видано на склад:{' '}
          <strong>
            {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
          </strong>
        </Typography>
        <Typography color='primary' sx={{ mt: 3 }}>
          Витрати матеріалів:
        </Typography>
        {goodsColor.map((color, index) =>
          color.colorArea > 0 ? (
            <Typography key={index}>
              {color.name}: {color.colorArea} м²
            </Typography>
          ) : null
        )}
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
