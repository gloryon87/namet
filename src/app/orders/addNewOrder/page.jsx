import React from 'react'
import AddOrderForm from '@/app/components/AddOrderForm/AddOrderForm'

const url = process.env.REACT_APP_SERVER_URL || ''

function addNewOrder () {
  return (
    <AddOrderForm url={url}/>
  )
}

export default addNewOrder
