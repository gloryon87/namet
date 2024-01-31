'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import { modalStyles } from '@/app/styles/modalStyles'
import { productions } from '@/app/variables'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function TransferMaterial ({ url, materials }) {
  const initialFormData = materials?.map(material => ({
    ...material,
    transferQty: 0
  }))

  const [openModal, setOpenModal] = useState(false)
  const [selectedProductionId, setSelectedProductionId] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const newFormData = [...formData]
    newFormData[index] = { ...newFormData[index], [name]: +value }
    setFormData(newFormData)
  }

  function handleClose () {
    setFormData(() => initialFormData)
    setSelectedProductionId('')
    setError(null)
    setLoading(null)
    setOpenModal(false)
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const updatedData = formData.filter(material => material.transferQty > 0)
    const updatedDataMaterials = updatedData.map(material => ({
      ...material,
      qty: material.qty - material.transferQty
    }))

    let updatedDataProduction = {}
    updatedDataProduction.materials = updatedData.map(material => ({
      ...material,
      qty: material.transferQty
    }))

    try {
      setLoading(true)
      setError(null)

      // Оновити матеріали та виробництво одночасно
      const [materialsResponse, productionResponse] = await Promise.all([
        fetch(`${url}/api/materials`, {
          method: 'PUT',
          headers: fetchParamsClient.headers,
          body: JSON.stringify(updatedDataMaterials)
        }),
        fetch(`${url}/api/production/${selectedProductionId}/materials`, {
          method: 'PUT',
          headers: fetchParamsClient.headers,
          body: JSON.stringify(updatedDataProduction)
        })
      ])

      // Обробка помилок матеріалів
      if (!materialsResponse.ok) {
        throw new Error(
          'Помилка! не вдалось оновити матеріали. Увага! Виробництво могло оновитись'
        )
      } else {
        setFormData(prevData => {
          // Оновити дані на основі старих даних (prevData) та оновлених матеріалів (updatedDataMaterials)
          const updatedFormData = prevData.map(material => {
            const updatedMaterial = updatedDataMaterials.find(
              updatedMaterial => updatedMaterial._id === material._id
            )
            if (updatedMaterial) {
              updatedMaterial.transferQty = 0
            }
            return updatedMaterial || material
          })

          return updatedFormData
        })
      }

      // Обробка помилок виробництва
      if (!productionResponse.ok) {
        throw new Error(
          'Помилка! не вдалось оновити виробництво. Увага! Матеріали могли списатись'
        )
      } else {
        setSelectedProductionId('')
      }

      setError(null)
      setLoading(null)
      setOpenModal(false)
      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Modal open={openModal} onClose={handleClose}>
        <Box component='form' onSubmit={e => handleSubmit(e)} sx={modalStyles}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Перемістити матеріали
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id='production-label'>Оберіть виробництво</InputLabel>
            <Select
              labelId='production-label'
              name='good'
              id='production-select'
              value={selectedProductionId}
              label='Оберіть виробництво'
              onChange={e => setSelectedProductionId(e.target.value)}
              required
            >
              {productions.map(production => (
                <MenuItem
                  value={production.id}
                  sx={{ display: 'flex' }}
                  key={production.id}
                >
                  <Typography>{production.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography gutterBottom>
            <b>Колір матеріал - залишок</b>
          </Typography>
          <Grid container spacing={1} sx={{ m: 0, width: 'auto' }}>
            {formData?.map((material, index) => (
              <Grid
                item
                xs={12}
                md={6}
                key={material._id}
                sx={{ display: 'flex', gap: 1, mb: 1 }}
              >
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
                  {material.color} {material.material} - {material.qty} м²
                </Typography>
                <TextField
                  label='Кількість'
                  name='transferQty'
                  type='number'
                  value={material.transferQty}
                  inputProps={{ min: 0, max: material.qty }}
                  onChange={e => handleChange(e, index)}
                  sx={{ width: '150px', height: '100%' }}
                />
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
              Перемістити
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
      {/* <Box sx={{ position: 'relative', backgroundColor: 'white' }}>
        <Fab
          sx={{
            position: 'fixed',
            textTransform: 'none',
            opacity: '90%',
            right: { xs: 200, sm: 210, xl: 'calc(5% + 180px)' },
            bottom: { xs: 20, sm: 30, lg: 35 }
          }}
          color='primary'
          aria-label='Перемістити'
          variant='extended'
          onClick={() => setOpenModal(true)}
        > */}
      <Button onClick={() => setOpenModal(true)} color='primary'>
        <EngineeringOutlinedIcon sx={{ mr: 1 }} /> Перемістити
      </Button>
      {/* </Fab>
      </Box> */}
    </Box>
  )
}

export default TransferMaterial
