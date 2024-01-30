'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { modalStyles } from '../../../styles/modalStyles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useRouter } from 'next/navigation'
import GoodEditForm from '../../GoodEditForm/GoodEditForm'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function ProductionGoodEdit ({ productionId, good, url, goodId }) {
  const [openModal, setOpenModal] = useState(false)
  const initialData = good
  delete initialData._id
  initialData.color = initialData.color?.map(color => ({
    name: color.name,
    qty: color.qty
  }))
  const [formData, setFormData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData)

    if (hasChanges) {
      handleEdit()
    } else {
      handleClose()
    }
  }

  function handleClose () {
    setFormData(() => ({ ...initialData }))
    setOpenModal(false)
  }

  async function handleEdit () {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(
        `${url}/api/production/${productionId}/goods/${goodId}`,
        {
          method: 'PUT',
          headers: fetchParamsClient.headers,
          body: JSON.stringify(formData)
        }
      )
      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      router.refresh()
      handleClose()
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати товар')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography color='primary'>Редагувати товар</Typography>
          <GoodEditForm
            formData={formData}
            onFormChange={newFormData => setFormData(() => newFormData)}
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
        <Tooltip title='Редагувати товар'>
          <EditOutlinedIcon />
        </Tooltip>
      </Button>
    </Box>
  )
}

export default ProductionGoodEdit
