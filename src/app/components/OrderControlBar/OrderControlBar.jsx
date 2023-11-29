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
import { useRouter } from 'next/navigation'

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflowY: 'auto',
  maxHeight: '100vh',
  maxHeight: '100lvh',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: '7px',
  p: 2,
}

  
function OrderControlBar({ order, url }) {
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const formatedDate = new Date(order.date).toISOString().split('T')[0]
    const formatedDeadline = new Date(order.deadline).toISOString().split('T')[0]
    const initialData = {...order, 
    date: formatedDate, deadline: formatedDeadline}
    const [formData, setFormData] = useState(initialData);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    onSubmit(formData);
  };


// API

// Delete the order

async function handleDelete() {
  try {
    setError(null)
    const res = await fetch(`${url}/api/orders/${order._id}`, { method: 'DELETE', })
    if (res.ok) {router.push('/orders')} 
    return res.json();
  } catch (error) {
    setError('Не вдалось видалити замовлення')
  }
  finally {setOpenDeleteModal(false)}
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
  finally {setOpenEditModal(false)}
}

  return (
    <>
      <Box sx={{display: 'flex', gap: 2, mt: 2}}>
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyles}>
            <form onSubmit={handleSubmit}>
      <TextField
        label="Замовник"
        name="contacts"
        value={formData.contacts}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {/* Date */}
      <TextField
        label="Дата замовлення"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
      />

      {/* Info */}
      <TextField
        label="Інфо"
        name="info"
        value={formData.info}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />

      {/* State */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Стан</InputLabel>
        <Select label="Стан" name="state" value={formData.state} onChange={handleChange}>
          <MenuItem value="прийнято">Прийнято</MenuItem>
          <MenuItem value="в роботі">В роботі</MenuItem>
          <MenuItem value="виконано">Виконано</MenuItem>
          <MenuItem value="відміна">Відміна</MenuItem>
        </Select>
      </FormControl>

      {/* Priority */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Пріоритет</InputLabel>
        <Select label="Пріоритет" name="priority" value={formData.priority} onChange={handleChange}>
          <MenuItem value="вис.">Високий</MenuItem>
          <MenuItem value="норм.">Нормальний</MenuItem>
          <MenuItem value="низ.">Низький</MenuItem>
        </Select>
      </FormControl>

      {/* Deadline */}
      <TextField
        label="Дедлайн"
        name="deadline"
        type="date"
        value={formData.deadline}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
      />


      {formData.goods.map((good, index) => (
        <Box key={index} marginY={2} sx={{border: 1, borderRadius: 2, p: 2}}>
            <Typography color='primary' align='center'>Товар №{index + 1}</Typography>
          <TextField
            label='Ширина'
            name={`goods[${index}].a`}
            value={good.a}
            onChange={handleChange}
            type="number"
            margin="normal"
          />
          <TextField
            label="Довжина"
            name={`goods[${index}].b`}
            value={good.b}
            onChange={handleChange}
            type="number"
            margin="normal"
          />
          <TextField
            label="Кількість"
            name={`goods[${index}].qty`}
            value={good.qty}
            onChange={handleChange}
            type="number"
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
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
              margin="normal"
            />
          ))}
        </Box>
      ))}
      <Button variant='contained' color='error' onClick={() => setOpenEditModal(false)} sx={{mr: 2}}>Відміна</Button>
      <Button type="submit" variant="contained" color="primary">
        Зберегти
      </Button>
    </form>
        </Box>
        </Modal>

        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
            <Box sx={modalStyles}>
            <Typography align='center' gutterBottom color='primary'>Точно видалити?</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Button variant='contained' onClick={() => setOpenDeleteModal(false)}>Ні</Button>
            <Button variant='contained' color='error' onClick={() => handleDelete()}>Так</Button>
            </Box>
            </Box>
        </Modal>

          <Button variant='contained' onClick={() => setOpenEditModal(true)}>Редагувати</Button>
          <Button variant='contained' color='error' onClick={() => setOpenDeleteModal(true)}>Видалити</Button> 
    </Box>
    {error && <Typography variant='h4' color='error'>{error}</Typography>}
    </>
  )
}

export default OrderControlBar