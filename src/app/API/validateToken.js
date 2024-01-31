import { fetchParamsServer } from "./fetchParamsServer";

const url = process.env.REACT_APP_SERVER_URL || ''

export default async function validateToken () {
  const fetchParams = fetchParamsServer()

  try {
    const res = await fetch(`${url}/api/check-token`, fetchParams)

    if (res.ok) {
      return true
    } else {
      throw new Error('Не вдалось валідувати токен')
    }
  } catch (error) {
    console.error('Error:', error.message)
    return false
  }
}
