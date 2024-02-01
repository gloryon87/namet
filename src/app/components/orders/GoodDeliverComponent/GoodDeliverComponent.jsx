'use client'
import React, { useState } from 'react'
import Good from '../Good/Good'
import FetchGoods from '../FetchGoods/FetchGoods'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { modalStyles } from '../../../styles/modalStyles'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function GoodDeliverComponent ({ orderId, orderContacts, good, url, goodId }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [selectedGood, setSelectedGood] = useState('')
  const [qty, setQty] = useState('')
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // Запит на оновлення товару у замовленні
      const updateGoodInOrder = fetch(
        `${url}/api/orders/${orderId}/goods/${goodId}`,
        {
          method: 'PUT',
          headers: fetchParamsClient.headers,
          body: JSON.stringify({
            ...good,
            delivered: (+good.delivered || 0) + +qty
          })
        }
      )

      // Запит на оновлення кількості товару на складі
      const deliveryInfo = {
        date: format(new Date(), 'dd.MM.yyyy'),
        orderId: orderId,
        qty: +qty,
        orderContacts: orderContacts
      }
      const updateStock = fetch(`${url}/api/goods/${selectedGood._id}`, {
        method: 'PUT',
        headers: fetchParamsClient.headers,
        body: JSON.stringify({
          ...selectedGood,
          qty: selectedGood.qty - qty,
          deliveries: [...selectedGood.deliveries, deliveryInfo]
        })
      })

      // Виконання обох запитів паралельно
      const [resGoodInOrder, resStock] = await Promise.all([
        updateGoodInOrder,
        updateStock
      ])

      if (!resGoodInOrder.ok) {
        throw new Error(
          `Не вдалось оновити замовлення! УВАГА! Товар міг списатись`
        )
      }

      if (!resStock.ok) {
        throw new Error(
          `Не вдалось списати товар. УВАГА! Замовлення могло оновитись`
        )
      }

      handleClose()
      router.refresh()
      return resGoodInOrder.json() // Повертаємо результат першого запиту
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClose () {
    setQty('')
    setSelectedGood('')
    setOpenModal(false)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyles}>
          <Box
            component='form'
            onSubmit={e => handleSubmit(e)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}
          >
            <Typography color='primary'>Видати сіточки</Typography>
            <Good good={good} />
            <FetchGoods
              url={url}
              good={good}
              qty={qty}
              setQty={setQty}
              selectedGood={selectedGood}
              setSelectedGood={setSelectedGood}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: { xs: 0, lg: 2 }
              }}
            >
              <Button
                variant='outlined'
                color='error'
                onClick={handleClose}
                sx={{ mr: 2 }}
              >
                Відміна
              </Button>
              <Button variant='outlined' color='primary' type='submit'>
                Видати
              </Button>
            </Box>
          </Box>
          {error && (
            <Typography variant='h4' color='error'>
              {error}
            </Typography>
          )}
          {loading && (
            <Typography variant='h6' color='primary'>
              попийте чайок...
            </Typography>
          )}
        </Box>
      </Modal>

      <Button color='primary' onClick={() => setOpenModal(true)}>
        <Tooltip title='Видати сіточки'>
          <ShoppingCartCheckoutOutlinedIcon />
        </Tooltip>
      </Button>
    </Box>
  )
}

export default GoodDeliverComponent
