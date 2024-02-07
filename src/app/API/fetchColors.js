const url = process.env.REACT_APP_SERVER_URL || ''
import { fetchParamsServer } from '@/app/API/fetchParamsServer'



async function fetchColors() {
  const fetchParams = fetchParamsServer()
    try {
      const response = await fetch(`${url}/api/colors`, fetchParams)
      const data = await response.json();
      const colorsArray = data.map(color => color.name)
      return colorsArray;
    } catch (error) {
      throw new Error(error.message)
    }
  }
  
  export default fetchColors;
