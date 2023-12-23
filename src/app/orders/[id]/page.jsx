import React from 'react'
import SingleOrder from '@/app/components/orders/SingleOrder/SingleOrder';
import Typography from '@mui/material/Typography'

const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Замовлення',
};


async function getData(id) {
  try {
    const res = await fetch(`${url}/api/orders/${id}`, { next: { revalidate: 0 } })
    const clonedResponse = res.clone();
    const jsonData = await clonedResponse.json();
    return jsonData;
  } catch (error) {
    throw new Error('Не вдалось отримати дані')
  }
}

async function singleOrder({ params }) {
  const  data  = await getData(params.id)
  return (<>
  {data[0] ? <SingleOrder order={data[0]}/> : <Typography variant='h5' align='center' color='error'>Замовлення не знайдено</Typography>}
  </>)
}

export default singleOrder