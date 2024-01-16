import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import calculateGoodsData from '@/app/utils/calculateGoodsData'
import Good from '../../orders/Good/Good'
import calculateMaterialsData from '@/app/utils/calculateMaterialsData'
import { format } from 'date-fns'


function Production ({ prod }) {
  const {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea,
    goodsColor
  } = calculateGoodsData(prod.goods)
  //  console.log(goodsColor)

  const materialDifferenceArray = calculateMaterialsData(
    prod.materials,
    goodsColor
  )
  // console.log(prod)

  return (
    <Link href={`/production/${prod.name}`}>
      <Grid
        container
        spacing={1}
        sx={{
          m: 0,
          border: 1,
          width: 'auto',
          borderTop: 0,
          fontSize: '1rem',
          '&:hover': { backgroundColor: '#eceff1' }
        }}
      >
        <Grid item xs={4} sx={{ border: '1px solid lightgrey' }}>
          {prod.name}
        </Grid>
        <Grid item xs={8} sx={{ border: '1px solid lightgrey' }}>
          {prod.contacts}
        </Grid>
        {/* Товари */}
          {prod.goods.length > 0 &&
            prod.goods.map(good => (
              <Box
                key={good._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  border: '1px solid lightgrey',
                }}
              >
                <Good good={good} />
                <Box sx={{ width: '120px' }}>
                  <Typography align='center'>
                    {format(new Date(good.date), 'dd.MM.yyyy')}{' '}
                  </Typography>
                </Box>
              </Box>
            ))}

        {/* Матеріали */}
        {prod.materials.length > 0 && (
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              columnGap: 1,
              border: '1px solid lightgrey',
              flexWrap: 'wrap'
            }}
          >
            {' '}
            {/* <Typography>
              {' '}
              <strong>Матеріали</strong>:
            </Typography>
            {prod.materials.map(material => (
              <Box key={material._id} display={'flex'} gap={1}>
                <Typography>
                  {material.material} {material.color}: {material.qty} м²,
                </Typography>
              </Box>
            ))}
            <Typography>
              <strong>Витрати матеріалів</strong>:
            </Typography>
            {goodsColor.map((color, index) =>
              color.colorArea > 0 ? (
                <Typography key={index}>
                  {color.name}: {color.colorArea} м²
                </Typography>
              ) : <Typography key={index}>
                -
              </Typography>
            )}
            <Typography> */}
            <Typography>
              {' '}
              <strong>Залишки матеріалів</strong>:
            </Typography>
            {materialDifferenceArray
              .filter(material => material.difference !== 0)
              .map((material, index) => (
                <Typography
                  color={material.difference > 0 ? null : 'error'}
                  key={index}
                >
                  {material.color}: {material.difference} м²,
                </Typography>
              ))}
          </Grid>
        )}
        <Box
          sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap', ml: 1, my: 1 }}
        >
          <Typography color='primary'>
            Площа сіточок в роботі:{' '}
            <strong>{goodsArea - goodsDeliveredArea} м²</strong>.
          </Typography>
          <Typography color='primary'>
            Кількість сіточок в роботі:{' '}
            <strong>{goodsQty - goodsDelivered} шт.</strong>{' '}
          </Typography>
          <Typography color='primary'>
            Видано на склад:{' '}
            <strong>
              {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
            </strong>
          </Typography>
        </Box>
      </Grid>
    </Link>
  )
}

export default Production
