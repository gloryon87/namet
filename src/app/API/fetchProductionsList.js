import { fetchParamsServer } from './fetchParamsServer'
import resHandler from './resHandler'
import { redirect } from 'next/navigation'

const url = process.env.REACT_APP_SERVER_URL || ''

export default async function fetchProductionsList () {
  const fetchParams = fetchParamsServer()
  try {
    const res = await fetch(`${url}/api/production`, fetchParams)
    return await resHandler(res)
  } catch (error) {
    if (error.message === 'Помилка валідації') {
      redirect('/')
    }
    throw new Error(error.message)
  }
}
