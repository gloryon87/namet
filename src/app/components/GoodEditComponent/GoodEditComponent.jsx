'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { modalStyles } from '../../styles/modalStyles'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useRouter } from 'next/navigation'
import { colors } from '../../variables.js'

function GoodEditComponent ({ orderId, good, url, goodId }) {
  const [openModal, setOpenModal] = useState(false)
  const initialData = good
  delete initialData._id;
  delete initialData.goodArea;
  initialData.color = initialData.color?.map(color => ({ 'name': color.name, 'qty': color.qty }))
  const [formData, setFormData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const router = useRouter() 

  const handleSubmit = e => {
    e.preventDefault()
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(good)

    if (hasChanges) {
      handleEdit();
    }
    else {setOpenModal(false)}
  }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
  const handleChangeNumber = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: +value });
    };
  

  function handleClose () {
    setOpenModal(false)
    setFormData(initialData)
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

  async function handleEdit () {
    try {
      setLoading(true);
      setError(null)
      const res = await fetch(`${url}/api/orders/${orderId}/goods/${goodId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
      throw new Error(`HTTP помилка! Статус: ${res.status}`);
    }
      router.refresh();
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати замовлення')
    } finally {
      setLoading(false);
      setOpenModal(false)
    }
  }

  return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Modal open={openModal} onClose={handleClose}>
          <Box sx={modalStyles}>
            <form onSubmit={e => handleSubmit(e)}>
              <Typography color='primary'>Редагувати товар</Typography>
          <Grid container spacing={2} sx={{mt: 1, mb: 3}}>
            <Grid item xs={12} md={4} >
            <TextField
            label='Ширина, м.'
            name={'a'}
            value={formData.a}
            onChange={handleChangeNumber}
            type="number"
            InputProps={{ inputProps: { min: 2, max: 8 } }}
            fullWidth
            required
              />
            </Grid>
          <Grid item xs={12} md={4} >
          <TextField
            label="Довжина, м."
            name={'b'}
            value={formData.b}
            onChange={handleChangeNumber}
            type="number"
            InputProps={{ inputProps: { min: 4, max: 16 } }}
            fullWidth
            required
          />
          </Grid>
          <Grid item xs={12} md={4} >
          <TextField
            label="Кількість"
            name={'qty'}
            value={formData.qty}
            onChange={handleChangeNumber}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
            required
          />
          </Grid>
          <Grid item xs={12} md={4} >
          <FormControl fullWidth>
            <InputLabel id="season">Сезон *</InputLabel>
            <Select
              name={'season'}
              labelId="season"
              label='Сезон *'
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
          <Grid item xs={12} md={4} >
          <TextField
            label="Матеріал"
            name={'material'}
            value={formData.material}
            onChange={handleChange}
            fullWidth
          />
          </Grid>
          <Grid item xs={12} md={4} >
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
            <Button variant='outlined' color='error' onClick={handleClose} sx={{mr: 2}}>
              Відміна
            </Button>
            <Button variant='outlined' color='primary' type='submit'>
              Зберегти
            </Button>
            </form>
          </Box>
        </Modal>

        <Button color='primary' onClick={() => setOpenModal(true)}>
          <EditOutlinedIcon/>
        </Button>
      {error && (
        <Typography variant='h4' color='error'>
          {error}
        </Typography>
      )}
      {loading && <Typography variant='h6' color='primary'>
          попийте чайок...
        </Typography>}
        </Box>
  )
}

export default GoodEditComponent
