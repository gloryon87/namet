'use client'
import React, { useState } from 'react'
import Good from '../Good/Good'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { modalStyles } from '../../../styles/modalStyles'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import { TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function GoodProductionComponent ({
  good,
  goodId,
  url,
  orderId,
  orderContacts,
  productions
}) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [qty, setQty] = useState(good.qty - (good.delivered || 0))
  const [production, setProduction] = useState({
    id: '',
    name: ''
  })
  const router = useRouter()

  // const goodToProductionColor = good.color.map(color => { color.name = color.name, color.colorArea = Math.ceil(color.colorArea / good.qty * qty) })

  // Функція закриття модального вікна

  function handleClose () {
    setQty(good.qty - (good.delivered || 0))
    setProduction({
      id: '',
      name: ''
    })
    setError(null)
    setOpenModal(false)
  }

  function handleChange (e) {
    setProduction({
      id: productions.find(production => production.name === e.target.value)._id,
      name: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // Запит на додавання товару на виробництво
      const updateProduction = fetch(
        `${url}/api/production/${production.id}/goods`,
        {
          method: 'POST',
          headers: fetchParamsClient.headers,
          body: JSON.stringify({
            ...good,
            qty: +qty,
            orderId: orderId,
            orderContacts: orderContacts
          })
        }
      )

      const updateOrder = await fetch(
        `${url}/api/orders/${orderId}/goods/${goodId}`,
        {
          method: 'PUT',
          headers: fetchParamsClient.headers,
          body: JSON.stringify({ production: production.name })
        }
      )

      const [resProduction, resOrder] = await Promise.all([
        updateProduction,
        updateOrder
      ])

      if (!resOrder.ok) {
        throw new Error(
          `Не вдалось оновити замовлення! УВАГА! Товар міг додатись на виробництво`
        )
      }

      if (!resProduction.ok) {
        throw new Error(
          `Не вдалось додати товар на виробництво. УВАГА! Замовлення могло оновитись`
        )
      }

      handleClose()
      router.refresh()
      return resProduction.json() // Повертаємо результат запиту
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <Typography color='primary'>Відправити у виробництво</Typography>
            <Good good={good} />
            <Box display='flex' gap={2}>
              <FormControl fullWidth>
                <InputLabel id='production'>Виробництво *</InputLabel>
                <Select
                  name={'production'}
                  labelId='production'
                  label='Виробництво *'
                  value={production.name || ''}
                  onChange={e => handleChange(e)}
                  required
                >
                  {productions.map(production => (
                    <MenuItem key={production._id} value={production.name}>
                      {production.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type='number'
                label='Кількість'
                value={qty}
                onChange={e => setQty(e.target.value)}
                sx={{ maxWidth: 150 }}
                fullWidth
                required
                InputProps={{
                  inputProps: {
                    min: 1
                  }
                }}
              />
            </Box>
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
                Відправити
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
        <Tooltip title='В роботу'>
          <EngineeringOutlinedIcon />
        </Tooltip>
      </Button>
    </Box>
  )
}

export default GoodProductionComponent
