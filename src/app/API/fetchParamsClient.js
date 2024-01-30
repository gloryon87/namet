import { getCookie } from 'cookies-next'

const token = getCookie('token')

export const fetchParamsClient = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}
