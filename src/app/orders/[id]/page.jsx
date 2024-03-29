import React from 'react'
import SingleOrder from '@/app/components/orders/SingleOrder/SingleOrder'
import Typography from '@mui/material/Typography'
import { fetchParamsServer } from '@/app/API/fetchParamsServer'
import resHandler from '@/app/API/resHandler'
import { redirect } from 'next/navigation'


const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Замовлення'
}

async function getData (id) {
  const fetchParams = fetchParamsServer()
  try {
    const res = await fetch(`${url}/api/orders/${id}`, fetchParams)
    return await resHandler(res)
  } catch (error) {
    if (error.message === 'Помилка валідації') {
      redirect('/')
    }
    throw new Error(error.message)
  }
}

async function singleOrder ({ params }) {
  const data = await getData(params.id)
  return (
    <>
      {data[0] ? (
        <SingleOrder order={data[0]} />
      ) : (
        <Typography variant='h5' align='center' color='error'>
          Замовлення не знайдено
        </Typography>
      )}
    </>
  )
}

export default singleOrder
