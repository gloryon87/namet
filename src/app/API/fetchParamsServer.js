import { cookies } from 'next/headers'

export const fetchParamsServer = () => {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  return { headers: { Authorization: `Bearer ${token}` }, next: {
    revalidate: 0
  }
  }
}


