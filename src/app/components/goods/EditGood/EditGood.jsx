'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { modalStyles } from '../../../styles/modalStyles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useRouter } from 'next/navigation'
import GoodEditForm from '../../GoodEditForm/GoodEditForm'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function EditGood ({ good, url, goodId, colors, colorSchemes }) {
  const [openModal, setOpenModal] = useState(false)
  const initialData = good
  delete initialData._id
  delete initialData.goodArea
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
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(good)

    if (hasChanges) {
      handleEdit()
    } else {
      setOpenModal(false)
    }
  }

  function handleClose () {
    setFormData(() => initialData)
    setOpenModal(false)
  }

  function handleDeleteDelivery (index) {
    const deliveries = formData.deliveries.filter((del, i) => i !== index)
    setFormData(prevData => ({
      ...prevData,
      deliveries: deliveries
    }))
  }

  async function handleEdit () {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${url}/api/goods/${goodId}`, {
        method: 'PUT',
        headers: fetchParamsClient.headers,
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      router.refresh()
      handleClose()
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати замовлення')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: -1, ml: -1 }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography color='primary'>Редагувати товар</Typography>
          <GoodEditForm
            formData={formData}
            onFormChange={newFormData => setFormData(() => newFormData)}
            delivery={false}
            colors={colors}
            colorSchemes={colorSchemes}
          />

          {formData.deliveries.length > 0 && (
            <>
              <Typography> Видачі </Typography>
              {formData.deliveries?.map((del, index) => (
                <Box
                  key={del._id}
                  sx={{
                    display: 'flex',
                    my: 1,
                    p: 1,
                    border: '1px solid lightgray',
                    borderRadius: 1
                  }}
                >
                  <Link href={`/orders/${del.orderId}`} target='_blank'>
                    <Typography sx={{ '&:hover': { color: 'blue' } }}>
                      {del.date} видано {del.qty} шт. {del.orderContacts}
                    </Typography>
                  </Link>
                  <Button
                    onClick={() => handleDeleteDelivery(index)}
                    color='error'
                    sx={{ ml: 'auto', mr: 1 }}
                  >
                    <DeleteForeverOutlinedIcon />
                  </Button>
                </Box>
              ))}
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
      <Tooltip title='Редагувати'>
        <Button color='primary' onClick={() => setOpenModal(true)}>
          <EditOutlinedIcon />
        </Button>
      </Tooltip>
    </Box>
  )
}

export default EditGood
