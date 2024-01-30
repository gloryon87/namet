'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { modalStyles } from '../../../styles/modalStyles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function EditMaterial ({ material, url, materialId }) {
  const [openModal, setOpenModal] = useState(false)
  const [qty, setQty] = useState(material.qty)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    const hasChanges = qty !== material.qty

    if (hasChanges) {
      handleEdit()
    } else {
      setOpenModal(false)
    }
  }

  function handleClose () {
    setQty(material.qty)
    setOpenModal(false)
  }

  async function handleEdit () {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${url}/api/materials/${materialId}`, {
        method: 'PUT',
        headers: fetchParamsClient.headers,
        body: JSON.stringify({ qty: qty })
      })
      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      router.refresh()
      setOpenModal(false)
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати матеріал')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: -1, ml: -1 }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography color='primary'>Редагувати матеріал</Typography>
          <Grid container spacing={1} sx={{ m: 0, width: 'auto' }}>
            <Grid item xs={8} md={10} sx={{ display: 'flex', height: 64 }}>
              <Typography
                sx={{
                  display: 'flex',
                  border: 1,
                  borderColor: 'grey.400',
                  width: '100%',
                  p: 1,
                  borderRadius: 1,
                  alignItems: 'center'
                }}
              >
                {material.color} {material.material}
              </Typography>
            </Grid>
            <Grid item xs={4} md={2}>
              <TextField
                label='Кількість'
                name={'qty'}
                value={qty}
                onChange={e => setQty(+e.target.value)}
                type='number'
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                required
              />
            </Grid>
          </Grid>
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

export default EditMaterial
