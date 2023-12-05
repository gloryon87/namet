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

const initialFromData = {material: "спанбонд", qty: 1, a: 4, b: 6, color: colors.map((color) => ({ name: color, qty: 0 })),}

function GoodsAddComponent({ orderId, url }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [formData, setFormData] = useState(initialFromData);
  const router = useRouter()


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  function handleClose () {
    setOpenModal(false)
    setFormData(initialFromData)
  }

const handleSelectColor = (name, value) => {
  setFormData((prevData) => {
    const prevColor = prevData.color || [];

    if (value === 0) {
      return { ...prevData, color: prevColor.filter((color) => color.name !== name) };
    }

    const updatedColor = prevColor.map((color) =>
      color.name === name ? { ...color, qty: +value } : color
    );

    return { ...prevData, color: updatedColor };
  });
};



async function handleSubmit(e) {
  e.preventDefault();
  const updatedColorData = formData.color.filter((color) => color.qty > 0);

  // try {
    // setLoading(true);
    // setError(null);

    // const res = await fetch(`${url}/api/orders/${orderId}/add-good`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...formData, color: updatedColorData }),
    // });

    // if (!res.ok) {
    //   throw new Error(`HTTP error! Status: ${res.status}`);
    // }

  //   setOpenModal(false);
  //   router.refresh();
  // } catch (error) {
  //   console.error(error);
  //   setError('Не вдалось додати товар');
  // } finally {
  //   setLoading(false);
  //   setFormData(initialFromData);
  // }

  console.log({ ...formData, color: updatedColorData });
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
            InputProps={{ inputProps: { min: 2, max: 8 } }}
            required
          />
          <TextField
            label="Довжина"
            name={'b'}
            value={formData.b}
            onChange={handleChange}
            type="number"
            InputProps={{ inputProps: { min: 4, max: 16 } }}
            required
          />
          <TextField
            label="Кількість"
            name={'qty'}
            value={formData.qty}
            onChange={handleChange}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
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
          {colors.map((color) => (
          <TextField
            label={color}
            key={color}
            name={color}
            value={formData.color.find(c => c.name === color)?.qty || 0}
            onChange={(e) => handleSelectColor(color, +e.target.value)}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
          />
      ))}
            <Button variant='outlined' color='error' onClick={handleClose}>
              Відміна
            </Button>
            <Button variant='outlined' color='primary' type='submit'>
              Зберегти
            </Button>
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