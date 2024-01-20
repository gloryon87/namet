'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { modalStyles } from '../../../styles/modalStyles'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'
import { colors } from '../../../variables.js'
import GoodEditForm from '../../GoodEditForm/GoodEditForm'

const initialFormData = {
  material: 'спанбонд',
  color: colors.map(color => ({ name: color, qty: 0 }))
}

function GoodsAddComponent ({ orderId, url }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

  function handleClose () {
    setFormData(() => initialFormData)
    setError(null)
    setLoading(null)
    setOpenModal(false)
  }

  async function handleSubmit (e) {
    e.preventDefault()
    const updatedColorData = formData.color.filter(color => color.qty > 0)
    if (updatedColorData.length === 0) return setError('Оберіть хоча б один колір')

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${url}/api/orders/${orderId}/add-good`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, color: updatedColorData })
      })

      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      setOpenModal(false)
      router.refresh()
    } catch (error) {
      setError('Не вдалось додати товар')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyles}>
          <Box component='form' onSubmit={handleSubmit}>
            <Typography color='primary'>
              Додати новий товар до замовлення
            </Typography>
            <GoodEditForm
              formData={formData}
              onFormChange={(newFormData) => setFormData(() => newFormData)}
              delivery={false}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='outlined'
                color='error'
                onClick={handleClose}
                sx={{ mr: 2 }}
              >
                Відміна
              </Button>
              <Button variant='outlined' color='primary' type='submit'>
                Зберегти
              </Button>
            </Box>
          </Box>
          {error && (
            <Typography variant='h5' color='error' align='center'>
              {error}
            </Typography>
          )}
          {loading && (
            <Typography variant='h6' color='primary' align='center'>
              попийте чайок...
            </Typography>
          )}
        </Box>
      </Modal>
      <Button onClick={() => setOpenModal(true)}>
        <AddIcon /> Додати товар
      </Button>
    </Box>
  )
}

export default GoodsAddComponent
