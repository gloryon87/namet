'use client'
import React, {useState} from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { colors } from '../../variables.js'
import { modalStyles } from '../../styles/modalStyles'

function GoodsEditComponent({goods, url}) {
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState(goods);
    const [error, setError] = useState(null)

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

    const handleRemoveGood = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      goods: prevData.goods.filter((_, i) => i !== index),
    }));
  };
  
    const handleColorChange = (index, name, value) => {
    const updatedColors = [...formData.goods[index].color];
    const colorIndex = updatedColors.findIndex((color) => color.name === name);
    updatedColors[colorIndex] = { ...updatedColors[colorIndex], qty: value };
    setFormData({
      ...formData,
      goods: [
        ...formData.goods.slice(0, index),
        { ...formData.goods[index], color: updatedColors },
        ...formData.goods.slice(index + 1),
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Отримайте змінені дані
    const changedData = Object.keys(formData).reduce((result, key) => {
      if (formData[key] !== initialData[key]) {
        result[key] = key === 'date' || key === 'deadline' ? formatToISOString(formData[key]) : formData[key];
        }
        
      return result;
    }, {});
    // onSubmit(changedData);
    console.log(changedData)
  };

    function handleClose () {
    setOpenModal(false)
    setFormData(initialData)
  }

  // Edit order

  async function handleEdit(editBody) {
  try {
    setError(null)
    const res = await fetch(`${url}/api/orders/${order._id}`, { method: 'PUT', headers: {
  'Content-type': 'application/json' }, body: JSON.stringify(editBody)
    })
  return res.json();}
  catch (error) {
    setError('Не вдалось відредагувати замовлення')
  }
  finally {setOpenModal(false)}
    }



  return (
    <>
      <Box sx={{display: 'flex', gap: 2, mt: 2}}>
        <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyles}>
            <form onSubmit={(e) => handleSubmit(e)}>
      
      {formData.goods.map((good, index) => (
        <Box key={index} marginY={2} sx={{display: 'flex', flexDirection: 'column', border: 1, borderRadius: 2, p: 2, gap: 2}}>
            <Typography color='primary' align='center'>Товар №{index + 1}</Typography>
          <TextField
            label='Ширина'
            name={`goods[${index}].a`}
            value={good.a}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Довжина"
            name={`goods[${index}].b`}
            value={good.b}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Кількість"
            name={`goods[${index}].qty`}
            value={good.qty}
            onChange={handleChange}
            type="number"
          />
          <FormControl fullWidth>
            <InputLabel>Сезон</InputLabel>
            <Select
              name={`goods[${index}].season`}
              label='Сезон'
              value={good.season}
              onChange={handleChange}
            >
              <MenuItem value="весна">Весна</MenuItem>
              <MenuItem value="літо">Літо</MenuItem>
              <MenuItem value="осінь">Осінь</MenuItem>
              <MenuItem value="зима">Зима</MenuItem>
            </Select>
          </FormControl>
          {good.color.map((color, colorIndex) => (
            <TextField
              key={colorIndex}
              label={color.name}
              value={color.qty}
              onChange={(e) =>
                handleColorChange(index, color.name, parseInt(e.target.value, 10) || 0)
              }
              type="number"
            />
          ))}
          <Button onClick={() => handleRemoveGood(index)}>Видалити товар</Button>
        </Box>
      ))}
      <Button variant='contained' color='error' onClick={handleClose} sx={{mr: 2}}>Відміна</Button>
      <Button type="submit" variant="contained" color="primary">
        Зберегти
      </Button>
    </form>
        </Box>
        </Modal>

          <Button variant='contained' onClick={() => setOpenModal(true)}>Редагувати</Button>
    </Box>
    {error && <Typography variant='h4' color='error'>{error}</Typography>}
    </>
  )
}

export default GoodsEditComponent