
export default async function resHandler(res) {
    if (res.ok) {
    const clonedResponse = res.clone()
      const jsonData = await clonedResponse.json()
    return jsonData
    } else {
      console.log(res)
    if (res.status === 401 || res.status === 403) {
      throw new Error('Помилка валідації')
    }
    throw new Error(`Помилка отримання данних з сервера: ${res.statusText}`)
  }
}
