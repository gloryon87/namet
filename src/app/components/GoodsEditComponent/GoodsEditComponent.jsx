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

const handleRemoveGood = (index) => {
  setFormData((prevGoods) => prevGoods.filter((_, i) => i !== index));
};
  
  const handleSubmit = (e) => {
    e.preventDefault();
       const changedData = Object.keys(formData).reduce((result, key) => {
      if (formData[key] !== goods[key]) {
        result[key] = formData[key];
      }
      return result;
    });
    // onSubmit(changedData);
    if (Object.keys(changedData).length !== 0) {
      console.log(changedData)
    }
  };

    function handleClose () {
    setOpenModal(false)
    setFormData(goods)
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
      
      {formData.map((good, index) => (
        <Box key={index} marginY={2} sx={{display: 'flex', flexDirection: 'column', border: 1, borderRadius: 2, p: 2, gap: 2}}>
            <Typography color='primary' align='center'>Товар №{index + 1}</Typography>
            <Typography>Розмір: {good.a} x {good.b}, кількість: {good.qty}. сезон: {good.season}</Typography>
          {/* <TextField
            label='Ширина'
            name={`goods[${index}].a`}
            value={good.a}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Довжина"
            name={`[${index}].b`}
            value={good.b}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Кількість"
            name={`[${index}].qty`}
            value={good.qty}
            onChange={handleChange}
            type="number"
          />
          <FormControl fullWidth>
            <InputLabel>Сезон</InputLabel>
            <Select
              name={`[${index}].season`}
              label='Сезон'
              value={good.season}
              onChange={handleChange}
            >
              <MenuItem value="весна">Весна</MenuItem>
              <MenuItem value="літо">Літо</MenuItem>
              <MenuItem value="осінь">Осінь</MenuItem>
              <MenuItem value="зима">Зима</MenuItem>
            </Select>
          </FormControl> */}
          <Typography>Кольори:</Typography>
          {good.color.map((color, colorIndex) => (
            <Typography key={colorIndex}>{color.name} - {color.qty}</Typography>
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

          <Button variant='contained' onClick={() => setOpenModal(true)}>Редагувати товари</Button>
    </Box>
    {error && <Typography variant='h4' color='error'>{error}</Typography>}
    </>
  )
}

export default GoodsEditComponent