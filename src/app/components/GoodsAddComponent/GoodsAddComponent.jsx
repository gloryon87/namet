'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { modalStyles } from '../../styles/modalStyles'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation'
import { colors } from '../../variables.js'

function GoodsAddComponent(orderId, url) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState({material: "спанбонд"});
  const router = useRouter()

    const handleChange = (e) => {
      const { name, value } = e.target;
    setFormData({ ...formData, [name]: value  });
  };

  function handleClose () {
    setOpenModal(false)
    setFormData({material: "спанбонд"})
  }

  function handleSubmit () {
    console.log(formData)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
    <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyles}>
        <Box component='form' onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}} >
    <TextField
            label='Ширина'
            name={'a'}
            value={formData.a}
            onChange={handleChange}
            type="number"
            required
          />
          <TextField
            label="Довжина"
            name={'b'}
            value={formData.b}
            onChange={handleChange}
            type="number"
            required
          />
          <TextField
            label="Кількість"
            name={'qty'}
            value={formData.qty}
            onChange={handleChange}
            type="number"
            required
          />
          <FormControl fullWidth>
            <InputLabel>Сезон</InputLabel>
            <Select
              name={'season'}
              label='Сезон'
              value={formData.season || ''}
              onChange={handleChange}
              required
            >
              <MenuItem value="весна">Весна</MenuItem>
              <MenuItem value="літо">Літо</MenuItem>
              <MenuItem value="осінь">Осінь</MenuItem>
              <MenuItem value="зима">Зима</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Матеріал"
            name={'material'}
            value={formData.material}
            onChange={handleChange}
          />
          <TextField
            label="Виробники"
            name={'production'}
            value={formData.production}
            onChange={handleChange}
          />
          </Box>
        </Box>
      </Modal>
      <Button  onClick={() => setOpenModal(true)}>
          <AddIcon/> Додати товар
        </Button>
      {error && (
        <Typography variant='h4' color='error'>
          {error}
        </Typography>
      )}
      {loading && <Typography variant='h4' color='primary'>
          попийте чайок...
        </Typography>}
      </Box>
  )
}

export default GoodsAddComponent