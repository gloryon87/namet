import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import calculateGoodsData from '@/app/utils/calculateGoodsData'
import Good from '../../orders/Good/Good'
import calculateMaterialsData from '@/app/utils/calculateMaterialsData'

function Production ({ prod }) {
  const {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea,
    goodsColor
  } = calculateGoodsData(prod.goods)

  const materialDifferenceArray = calculateMaterialsData(
    prod.materials,
    goodsColor
  )

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
        {prod.goods.length > 0 && (
          <Grid item xs={12} sx={{ border: '1px solid lightgrey' }}>
            {prod.goods.map(good => (
              <Good key={good._id} good={good} />
            ))}
          </Grid>
        )}

        {/* Матеріали */}
        {prod.materials.length > 0 && (
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', gap: 1, border: '1px solid lightgrey', flexWrap: 'wrap' }}
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
            <Typography>  <strong>Залишки матеріалів</strong>:
            </Typography>
            {materialDifferenceArray.map((material, index) => (
              material.difference ?
              <Typography
                color={material.difference > 0 ? null : 'error'}
                key={index}
              >
                {material.color}: {material.difference} м²,
              </Typography> : null
            ))}
          </Grid>
        )}
        <Typography color='primary' sx={{ ml: 1, my: 1 }}>
          Площа сіточок в роботі:{' '}
          <strong>{goodsArea - goodsDeliveredArea} м²</strong>. Кількість
          сіточок в роботі: <strong>{goodsQty - goodsDelivered} шт.</strong>{' '}
          Видано на склад:{' '}
          <strong>
            {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
          </strong>
        </Typography>
      </Grid>
    </Link>
  )
}

export default Production
