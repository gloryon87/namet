import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import calculateGoodsData from '../utils/calculateGoodsData'
import Production from '../components/production/Production/Production'


// Metadata

export const metadata = {
  title: 'Виробники'
}

// Data

const url = process.env.REACT_APP_SERVER_URL || ''

async function getData () {
  try {
    const res = await fetch(url + '/api/production', { next: { revalidate: 0 } })
    if (res.ok) {
      const jsonData = await res.json()
      return jsonData
    } else {
      throw new Error('Помилка сервера')
    }
  } catch (error) {
    throw new Error('Не вдалось отримати дані')
  }
}

export default async function ProductionPage () {
  // Get data
  const data = await getData()
  const goodsArray = data?.flatMap(prod => prod.goods)

  // Calculate goods data
  const { goodsQty, goodsArea, goodsDelivered, goodsDeliveredArea } =
    calculateGoodsData(goodsArray)

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Виробники
      </Typography>
      <Typography color='primary' sx={{ mb: 2 }}>
        Загальна площа сіточок на виробництві:{' '}
        <strong>{goodsArea - goodsDeliveredArea} м²</strong>. Загальна кількість сіточок:{' '}
        <strong>{goodsQty - goodsDelivered} шт.</strong> Видано на склад:{' '}
        <strong>
          {goodsDelivered} шт. ({goodsDeliveredArea} м²){' '}
        </strong>
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{
          m: 0,
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
      </Grid>

      {/* Виробництва */}
      <ol>
        {data?.length > 0 &&
          data.map(prod => (
            <li key={prod._id} style={{ fontSize: 13 }}>
              <Production prod={ prod } />
            </li>
          ))}
      </ol>
    </>
  )
}
