'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { modalStyles } from '../../styles/modalStyles'

function GoodsEditComponent ({ goods, url }) {
   const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState(goods)
  const [error, setError] = useState(null)

  const handleRemoveGood = index => {
    setFormData(prevGoods => prevGoods.filter((_, i) => i !== index))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(goods)

    if (hasChanges) {
      // onSubmit(formData);
      console.log(formData)
    }
    setOpenModal(false)
  }

  function handleClose () {
    setOpenModal(false)
    setFormData(goods)
  }

  // Edit order

  async function handleEdit (editBody) {
    try {
      setError(null)
      const res = await fetch(`${url}/api/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(editBody)
      })
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати замовлення')
    } finally {
      setOpenModal(false)
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Modal open={openModal} onClose={handleClose}>
          <Box sx={modalStyles}>
            <form onSubmit={e => handleSubmit(e)}>
              {formData.map((good, index) => (
                <Box
                  key={index}
                  marginY={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: 1,
                    borderRadius: 2,
                    p: 2,
                    gap: 2
                  }}
                >
                  <Typography color='primary' align='center'>
                    Товар №{index + 1}
                  </Typography>
                  <Typography>
                    Розмір: {good.a} x {good.b}, кількість: {good.qty}. сезон:{' '}
                    {good.season}
                  </Typography>
                  <Typography>Кольори:</Typography>
                  {good.color.map((color, colorIndex) => (
                    <Typography key={colorIndex}>
                      {color.name} - {color.qty}
                    </Typography>
                  ))}
                  <Button
                    variant='outlined'
                    onClick={() => handleRemoveGood(index)}
                  >
                    Видалити товар
                  </Button>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button color='primary' variant='outlined'>
                  Додати товар
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant='contained'
                  color='error'
                  onClick={handleClose}
                  sx={{ mr: 2 }}
                >
                  Відміна
                </Button>
                <Button type='submit' variant='contained' color='primary'>
                  Зберегти
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>

        <Button variant='contained' onClick={() => setOpenModal(true)}>
          Редагувати товари
        </Button>
      </Box>
      {error && (
        <Typography variant='h4' color='error'>
          {error}
        </Typography>
      )}
    </>
  )
}

export default GoodsEditComponent
