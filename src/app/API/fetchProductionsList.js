import { fetchParamsServer } from "./fetchParamsServer"


const url = process.env.REACT_APP_SERVER_URL || ''


export default async function fetchProductionsList () {
    const fetchParams = fetchParamsServer()
try {
    const res = await fetch(`${url}/api/production`, fetchParams)
  if (res.ok) {
  const jsonData = await res.json()
  return jsonData
} else {
  throw new Error(`Помилка отримання данних з сервера: ${res.statusText}`)
}
} catch (error) {

  throw new Error(error.message)
}

} 