import React from 'react'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
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
import fetchColors from '@/app/API/fetchColors'
import fetchColorSchemes from '@/app/API/fetchColorSchemes'

const url = process.env.REACT_APP_SERVER_URL || ''

const gridItemStyle = {
  // border: '1px solid lightgrey',
  // p: 1,
  // textAlign: 'end'
}

async function SingleProduction({ production }) {
  const {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea,
    goodsColor
  } = calculateGoodsData(production.goods)

  const colors = await fetchColors()
  const colorSchemes = await fetchColorSchemes()

  const mergedProductionMaterials = production.materials?.reduce((acc, item) => {
    const existingItem = acc.find(accItem => accItem.color === item.color);

    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      acc.push({ color: item.color, qty: item.qty });
    }
    return acc;
  }, []);


  const materialDifferenceArray = calculateMaterialsData(
    mergedProductionMaterials,
    goodsColor
  )

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap' }}>
        <Link href='/production'>
          <Typography color='primary' sx={{ '&:hover': { color: '#2c387e' } }}>
            Всі виробники
          </Typography>
        </Link>
        <Typography>
          {' '}
          <KeyboardArrowRightOutlinedIcon />{' '}
        </Typography>
        <Typography color='grey'> {production.name} </Typography>
      </Box>

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
        <Grid
          item
          xs={8}
          lg={10}
          border={1}
          sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap' }}
        >
          {production.materials
            .filter(material => material.qty > 0)
            .map(material => (
              <Typography key={material._id}>
                {material.material} {material.color}: {material.qty} м²,
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
              <Link
                style={{ width: '100%' }}
                target='_blank'
                href={`/orders/${good.orderId}`}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    '&:hover': { backgroundColor: '#eceff1' }
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
              goodColor={good.color}
              url={url}
              production={production}
            />
            <ProductionGoodEdit
              productionId={production._id}
              good={good}
              goodId={good._id}
              url={url}
              colors={colors}
              colorSchemes={colorSchemes}
            />
            <ProductionGoodDelete
              productionId={production._id}
              goodId={good._id}
              url={url}
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        <Box
          border={1}
          borderRadius={2}
          sx={{
            p: 2,
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
        </Box>
        {/* <Box
          border={1}
          borderRadius={2}
          sx={{
            p: 2,
            boxShadow: 2,
            width: 'max-content',
            maxWidth: '100%'
          }}
        >
          <Typography color='primary'>Витрати матеріалів:</Typography>
          {goodsColor.map((color, index) =>
            color.colorArea > 0 ? (
              <Typography key={index}>
                {color.name}: {color.colorArea} м²
              </Typography>
            ) : null
          )}
        </Box> */}
        {/* <Box
          border={1}
          borderRadius={2}
          sx={{
            p: 2,
            boxShadow: 2,
            width: 'max-content',
            maxWidth: 600
          }}
        > */}
          {/* <Typography color='primary'>Залишки матеріалів:</Typography>
          {materialDifferenceArray
            .filter(material => material.difference !== 0)
            .map((material, index) => (
              <Typography
                color={material.difference > 0 ? null : 'error'}
                key={index}
              >
                {material.color}: {material.difference} м²
              </Typography>
            ))} */}
          <Grid
            container
          spacing={1}
          border={1}
          borderRadius={2}
          sx={{
            m: 0,
            p: 2,
            boxShadow: 2,
            minWidth: 'min-content',
            maxWidth: 600,
          }}
          >
            <Grid item xs={3} sx={gridItemStyle}>
              <Typography color='primary'>Колір</Typography>
            </Grid>
            <Grid item xs={3} sx={gridItemStyle}>
              <Typography color='primary'>Наявність</Typography>
            </Grid>
            <Grid item xs={3} sx={gridItemStyle}>
              <Typography color='primary'>Потреба</Typography>
            </Grid>
            <Grid item xs={3} sx={gridItemStyle}>
              <Typography color='primary'>Залишок</Typography>
            </Grid>

            {goodsColor.map((colorItem, index) => {
              const correspondingMaterial = mergedProductionMaterials.find(
                item => item.color === colorItem.name
              )
              const correspondingDifference = materialDifferenceArray.find(
                item => item.color === colorItem.name
              )

              return (
                <React.Fragment key={index}>
                  <Grid item xs={3} sx={gridItemStyle}>
                    <Typography>{colorItem.name}</Typography>
                  </Grid>
                  <Grid item xs={3} sx={gridItemStyle}>
                    <Typography>
                      {correspondingMaterial ? correspondingMaterial.qty : 0} м²
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sx={gridItemStyle}>
                    <Typography>{colorItem.colorArea} м²</Typography>
                  </Grid>
                  <Grid item xs={3} sx={gridItemStyle}>
                    <Typography
                      color={
                        correspondingDifference.difference > 0 ? null : 'error'
                      }
                    >
                      {correspondingDifference
                        ? correspondingDifference.difference
                        : ''}{' '}
                      м²
                    </Typography>
                  </Grid>
                </React.Fragment>
              )
            })}
          </Grid>
        {/* </Box> */}
      </Box>
    </>
  )
}

export default SingleProduction
