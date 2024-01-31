import React from 'react'
import Typography from '@mui/material/Typography'
import SingleProduction from '@/app/components/production/SingleProduction/SingleProduction';
import { fetchParamsServer } from '@/app/API/fetchParamsServer'
import resHandler from '@/app/API/resHandler';



const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Виробництво',
};

async function getData(name) {
  const fetchParams = fetchParamsServer()
  try {
    const res = await fetch(`${url}/api/production/${name}`, fetchParams)
    return await resHandler(res)

  } catch (error) {
    throw new Error(error.message)
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