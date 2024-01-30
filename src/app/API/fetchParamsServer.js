import { cookies } from 'next/headers'
// const cookieStore = cookies()
// const token = cookieStore.get('token').value

// export const fetchParamsServer = { headers: { Authorization: `Bearer ${token}` }, next: {
//   revalidate: 0
// }
//  }

export const fetchParamsServer = () => {
  const cookieStore = cookies()
  const token = cookieStore.get('token').value
  return { headers: { Authorization: `Bearer ${token}` }, next: {
    revalidate: 0
  }
  }
}


