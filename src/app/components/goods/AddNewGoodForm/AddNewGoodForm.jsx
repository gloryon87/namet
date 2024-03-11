'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { fetchParamsClient } from '@/app/API/fetchParamsClient.js'
import GoodEditForm from '../../GoodEditForm/GoodEditForm'

function AddNewGoodForm ({ url, colors, colorSchemes }) {
  const initialFormData = {
    material: 'спанбонд',
    color: colors?.map(color => ({ name: color, qty: 0 })),
    deliveries: [],
    _id: 0
  }
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

  async function handleSubmit (e) {
    e.preventDefault()
    const updatedColorData = formData.color.filter(color => color.qty > 0)

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${url}/api/goods`, {
        method: 'POST',
        headers: fetchParamsClient.headers,
        body: JSON.stringify({ ...formData, color: updatedColorData })
      })

      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }

      setFormData(() => initialFormData)
      router.push('/goods')
      router.refresh()
    } catch (error) {
      setError('Не вдалось додати товар')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Box component='form' onSubmit={handleSubmit}>
        <Typography color='primary'>Додати новий товар</Typography>
        <GoodEditForm
          formData={formData}
          onFormChange={newFormData => setFormData(() => newFormData)}
          delivery={false}
          colors={colors}
          colorSchemes={colorSchemes}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='outlined'
            color='error'
            onClick={() => router.push('/goods')}
            sx={{ mr: 2 }}
          >
            Вийти
          </Button>
          <Button variant='outlined' color='primary' type='submit'>
            Зберегти
          </Button>
        </Box>
      </Box>
      {error && (
        <Typography variant='h5' color='error'>
          {error}
        </Typography>
      )}
      {loading && (
        <Typography variant='h6' color='primary'>
          попийте чайок...
        </Typography>
      )}
    </>
  )
}

export default AddNewGoodForm
