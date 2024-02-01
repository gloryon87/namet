import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import calculateGoodsData from '../utils/calculateGoodsData'
import calculateMaterialsData from '../utils/calculateMaterialsData'
import Production from '../components/production/Production/Production'
import { fetchParamsServer } from '@/app/API/fetchParamsServer'
import resHandler from '../API/resHandler'

const _ = require('lodash')

// Metadata

export const metadata = {
  title: 'Виробники'
}

// Data

const url = process.env.REACT_APP_SERVER_URL || ''

async function getData() {
  const fetchParams = fetchParamsServer()
  try {
    const res = await fetch(url + '/api/production', fetchParams)
    return await resHandler(res)
  } catch (error) {
    throw new Error(error.message)
  }
}

export default async function ProductionPage () {
  // Get data
  const data = await getData()

  const copiedData = _.cloneDeep(data)
  const goodsArray = copiedData?.flatMap(prod => prod.goods)

  // Calculate goods data
  const { goodsQty, goodsArea, goodsDelivered, goodsDeliveredArea, goodsColor } =
    calculateGoodsData(goodsArray)

  // Calculate materials data
  const materialsArray = copiedData?.flatMap(prod => prod.materials)?.reduce((accumulator, currentValue) => {
    const existingMaterialIndex = accumulator.findIndex(
      obj => obj.color === currentValue.color
      )
      
      if (existingMaterialIndex !== -1) {
        // Якщо матеріал знайдено, об'єднайте його з поточним значенням
        accumulator[existingMaterialIndex].qty += currentValue.qty
      } else {
        // Якщо матеріал не знайдено, додайте поточне значення в аккумулятор
        accumulator.push(currentValue)
      }
      
      return accumulator
  }, [])
  
    // Calculate materials difference
    const materialDifferenceArray = calculateMaterialsData(
  materialsArray,
  goodsColor
)

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Виробники
      </Typography>
      <Box sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap', mb: 2 }}>
      <Typography color='primary'>
        Загальна площа сіточок в роботі:{' '}
        <strong>{goodsArea - goodsDeliveredArea} м²</strong>.
      </Typography>
      <Typography color='primary'>
        Загальна кількість сіточок в роботі:{' '}
        <strong>{goodsQty - goodsDelivered} шт.</strong>
      </Typography>
      <Typography color='primary'>
        Видано на склад:{' '}
        <strong>
          {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
        </strong>
        </Typography>
        </Box>
       <Box sx={{display: 'flex', columnGap: 1, flexWrap: 'wrap', mb: 1 }}> <Typography color='primary'>Загальні залишки матеріалів:</Typography>
        {materialDifferenceArray?.flatMap(
          (material, index) => (
            material.difference ? (
              <Typography
                color={material.difference > 0 ? null : 'error'}
                key={index}
              >
                {material.color}: {material.difference} м², 
              </Typography>
            ) : null
          )
        )}
        </Box>

      {/* <Grid
        container
        spacing={1}
        sx={{
          m: 0,
          mt: 2,
          width: 'auto',
          border: 1,
          position: 'sticky',
          top: 0,
          backgroundColor: 'white'
        }}
      >
        <Grid item xs={4} sx={{ border: 1 }}>
          {' '}
          Виробник{' '}
        </Grid>
        <Grid item xs={8} sx={{ border: 1 }}>
          {' '}
          Контакти{' '}
        </Grid>
      </Grid> */}

      {/* Виробництва */}
      <Box component='ol' sx={{ border: 1}}>
        {data?.length > 0 &&
          data.map(prod => (
            <li key={prod._id} style={{ fontSize: 13 }}>
              <Production prod={ prod } />
            </li>
          ))}
      </Box>
    </>
  )
}
