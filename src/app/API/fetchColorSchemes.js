const url = process.env.REACT_APP_SERVER_URL || ''

async function fetchColorSchemes () {
  try {
    const response = await fetch(`${url}/api/color-schemes`)
    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

export default fetchColorSchemes
