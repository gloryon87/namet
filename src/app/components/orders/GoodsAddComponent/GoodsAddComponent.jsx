'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { modalStyles } from '../../../styles/modalStyles'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation'
import { colors } from '../../../variables.js'

const initialFormData = {material: "спанбонд", color: colors.map((color) => ({ name: color, qty: 0 })),}

function GoodsAddComponent({ orderId, url }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter() 


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  function handleClose () {
    setFormData(() => initialFormData)
    setOpenModal(false)
  }

const handleSelectColor = (name, value) => {
  setFormData((prevData) => {
    const prevColor = prevData.color || [];

    if (value === 0) {
      return { ...prevData, color: prevColor.filter((color) => color.name !== name) };
    }

    const existingColor = prevColor.find((color) => color.name === name);

    if (existingColor) {
      existingColor.qty = +value;
    } else {
      const updatedColor = { name, qty: +value };
      prevColor.push(updatedColor);
    }

    return { ...prevData, color: prevColor };
  });
};




async function handleSubmit(e) {
  e.preventDefault();
  const updatedColorData = formData.color.filter((color) => color.qty > 0);

  try {
    setLoading(true);
    setError(null);

    const res = await fetch(`${url}/api/orders/${orderId}/add-good`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, color: updatedColorData }),
    });

    if (!res.ok) {
      throw new Error(`HTTP помилка! Статус: ${res.status}`);
    }
    handleClose()
    router.refresh();
  } catch (error) {
    setError('Не вдалось додати товар');
  } finally {
    setLoading(false);
  }

}

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
    <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyles}>
        <Box component='form' onSubmit={handleSubmit} >
          <Typography color='primary'>Додати новий товар до замовлення</Typography>
          <Grid container spacing={2} sx={{mt: 1, mb: 3}}>
            <Grid item xs={12} md={3} >
    <TextField
            label='Ширина, м.'
            name={'a'}
            value={formData.a}
            onChange={handleChange}
            type="number"
            InputProps={{ inputProps: { min: 2, max: 8 } }}
            fullWidth
            required
              />
            </Grid>
          <Grid item xs={12} md={3} >
          <TextField
            label="Довжина, м."
            name={'b'}
            value={formData.b}
            onChange={handleChange}
            type="number"
            InputProps={{ inputProps: { min: 4, max: 16 } }}
            fullWidth
            required
          />
          </Grid>
          <Grid item xs={12} md={3} >
          <TextField
            label="Кількість"
            name={'qty'}
            value={formData.qty}
            onChange={handleChange}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
            required
          />
              </Grid>
          <Grid item xs={12} md={3}>
                <TextField
                  label='Видано'
                  name={'delivered'}
                  value={formData.delivered}
                  onChange={handleChange}
                  type='number'
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
          <Grid item xs={12} md={3} >
          <FormControl fullWidth>
            <InputLabel>Сезон *</InputLabel>
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
          </Grid>
          <Grid item xs={12} md={3} >
          <TextField
            label="Матеріал"
            name={'material'}
            value={formData.material}
            onChange={handleChange}
            fullWidth
          />
          </Grid>
          <Grid item xs={12} md={6} >
          <TextField
            label="Виробники"
            name={'production'}
            value={formData.production}
            onChange={handleChange}
            fullWidth
            />
            </Grid>
            <Grid item xs={12}><Typography> Кольори </Typography></Grid>
              {colors.map((color) => (
           <Grid item xs={12} md={4} key={color}>
          <TextField
            label={color}
            name={color}
            value={formData.color.find(c => c.name === color)?.qty || 0}
            onChange={(e) => handleSelectColor(color, +e.target.value)}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            fullWidth
          />
          </Grid>
      ))}
      </Grid>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button variant='outlined' color='error' onClick={handleClose} sx={{mr: 2}}>
              Відміна
            </Button>
            <Button variant='outlined' color='primary' type='submit'>
              Зберегти
            </Button>
          </Box>
          </Box>
        </Box>
      </Modal>
      <Button  onClick={() => setOpenModal(true)}>
          <AddIcon/> Додати товар
        </Button>
      {error && (
        <Typography variant='h5' color='error'>
          {error}
        </Typography>
      )}
      {loading && <Typography variant='h6' color='primary'>
          попийте чайок...
        </Typography>}
      </Box>
  )
}

export default GoodsAddComponent