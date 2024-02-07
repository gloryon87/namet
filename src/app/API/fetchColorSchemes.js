const url = process.env.REACT_APP_SERVER_URL || ''
import { fetchParamsServer } from '@/app/API/fetchParamsServer'


async function fetchColorSchemes() {
  const fetchParams = fetchParamsServer()
  try {
    const response = await fetch(`${url}/api/color-schemes`, fetchParams)
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

export default fetchColorSchemes
