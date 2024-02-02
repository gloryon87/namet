const url = process.env.REACT_APP_SERVER_URL || ''


async function fetchColors() {
    try {
      const response = await fetch(`${url}/api/colors`)
      const data = await response.json();
      const colorsArray = data.map(color => color.name)
      return colorsArray;
    } catch (error) {
      throw new Error(error.message)
    }
  }
  
  export default fetchColors;
