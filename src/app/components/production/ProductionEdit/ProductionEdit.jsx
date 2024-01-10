'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'
import { modalStyles } from '../../../styles/modalStyles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

function ProductionEdit ({ production, url }) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ ...production })

  const router = useRouter()

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  function handleChangeMaterial (e, index, field) {
    const { value } = e.target
    setFormData(prevData => {
      const newMaterials = prevData.materials.map((material, i) => {
        if (i === index) {
          return { ...material, [field]: value }
        }
        return material
      })
      return { ...prevData, materials: newMaterials }
    })
  }

  function handleClose () {
    setFormData(() => ({ ...production }))
    setOpenEditModal(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(production)

    if (hasChanges) {
      handleEdit()
    } else {
      handleClose()
    }
  }

  async function handleEdit () {
    try {
      setError(null)
      const res = await fetch(`${url}/api/production/${production._id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      router.refresh()
      setOpenEditModal(false)
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати виробництво')
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Modal open={openEditModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography variant='h5' sx={{ mb: 1 }}>
            Редагувати виробництво
          </Typography>
          <Typography variant='h6'>{ production.name }</Typography>
          <TextField
            label='Контакти'
            name='contacts'
            value={formData.contacts}
            onChange={handleChange}
            fullWidth
            margin='normal'
            sx={{ mb: 2 }}
          />
          <Typography variant='h6' sx={{ mb: 2 }}>
            Матеріали
          </Typography>
          {formData.materials.map((material, index) => (
            <Box key={material._id} sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                label='Матеріал'
                name={`material-${index}`}
                value={material.material || ''}
                onChange={e => handleChangeMaterial(e, index, 'material')}
                fullWidth
              />
              <TextField
                label='Колір'
                name={`color-${index}`}
                value={material.color || ''}
                onChange={e => handleChangeMaterial(e, index, 'color')}
                fullWidth
              />
              <TextField
                label='Кількість'
                name={`qty-${index}`}
                value={material.qty || 0}
                onChange={e => handleChangeMaterial(e, index, 'qty')}
                type='number'
                fullWidth
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 1, gap: 2 }}>
            <Button
              variant='outlined'
              color='error'
              onClick={handleClose}
            >
              Відміна
            </Button>
            <Button
              type='submit'
              variant='outlined'
              color='primary'
            >
              Зберегти
            </Button>
          </Box>
          {error && (
            <Typography variant='h4' color='error'>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
      <Tooltip title='Редагувати виробництво'>
        <Button onClick={() => setOpenEditModal(true)}>
          <EditOutlinedIcon />
        </Button>
      </Tooltip>
    </Box>
  )
}

export default ProductionEdit
