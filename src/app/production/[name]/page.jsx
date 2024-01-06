import React from 'react'
import Typography from '@mui/material/Typography'
import SingleProduction from '@/app/components/production/SingleProduction/SingleProduction';


const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Виробництво',
};

async function getData(name) {
  
  try {
    const res = await fetch(`${url}/api/production/${name}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store'
      }
    })
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

async function ProductionSite({ params }) {
    const  data  = await getData(params.name)
    return (
        <>
    {data[0] ? <SingleProduction production={data[0]}/> : <Typography variant='h5' align='center' color='error'>Виробника не знайдено</Typography>}
        </>
  )
}

export default ProductionSite