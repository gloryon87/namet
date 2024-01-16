'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add'
import { modalStyles } from '@/app/styles/modalStyles'
import { colors } from '@/app/variables'

const initialFormData = colors.map(color => ({
  color: color,
  qty: 0,
  material: 'спанбонд'
}))

function AddMaterial ({ url }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const newFormData = [...formData]
    newFormData[index] = { ...newFormData[index], [name]: value }
    setFormData(newFormData)
  }

  function handleClose () {
    setFormData(() => initialFormData)
    setOpenModal(false)
  }

  async function handleSubmit (e) {
    e.preventDefault()
    const updatedData = formData.filter(color => color.qty > 0)

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${url}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...updatedData])
      })

      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }

      setFormData(() => initialFormData)
      router.refresh()
      setOpenModal(false)
    } catch (error) {
      setError('Не вдалось додати матеріал')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Додати матеріали
          </Typography>
          <Grid container spacing={2} sx={{ m: 0, width: 'auto' }}>
            {formData.map((color, index) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={color._id}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    border: 1,
                    // borderColor: 'grey.400',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Typography
                    sx={{
                      display: 'flex',
                      width: 240,
                      p: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  >
                    {color.color}
                  </Typography>
                  <TextField
                    label='Матеріал'
                    name='material'
                    type='text'
                    value={color.material}
                    onChange={e => handleChange(e, index)}
                    sx={{ width: 240 }}
                  />
                  <TextField
                    label='Кількість'
                    name='qty'
                    type='number'
                    value={color.qty}
                    inputProps={{ min: 0 }}
                    onChange={e => handleChange(e, index)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 4,
              mb: 1,
              gap: 2
            }}
          >
            <Button variant='outlined' color='error' onClick={handleClose}>
              Відміна
            </Button>
            <Button type='submit' variant='outlined' color='primary'>
              Додати
            </Button>
          </Box>
          {error && (
            <Typography variant='h4' color='error'>
              {error}
            </Typography>
          )}
          {loading && (
            <Typography variant='h4' color='primary'>
              Завантаження...
            </Typography>
          )}
        </Box>
      </Modal>
      {/* <Box sx={{ position: 'relative', backgroundColor: 'white' }}> */}
      {/* <Fab
          sx={{
            position: 'fixed',
            textTransform: 'none',
            opacity: '90%',
            right: { xs: 20, sm: 30, xl: '5%' },
            bottom: { xs: 20, sm: 30, lg: 35 }
          }}
          color='primary'
          aria-label='Додати матеріали'
          variant='extended'
          onClick={() => setOpenModal(true)}
        > */}
      <Button onClick={() => setOpenModal(true)} color='primary'>
        <AddIcon sx={{ mr: 1 }} /> Додати
      </Button>
      {/* </Fab> */}
      {/* </Box> */}
    </Box>
  )
}

export default AddMaterial
