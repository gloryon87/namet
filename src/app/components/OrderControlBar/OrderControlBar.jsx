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
import { modalStyles } from '../../styles/modalStyles'
  
function OrderControlBar({ order, url }) {
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const formatToISOString = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

    const initialData = {...order, 
    date: formatDate(order.date),
  deadline: formatDate(order.deadline),}
    const [formData, setFormData] = useState(initialData);


  const handleChange = (e) => {
      const { name, value } = e.target;
      const formattedValue = name === 'date' ? formatDate(new Date(value)) : value;
    setFormData({ ...formData, [name]: formattedValue  });
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

    // Викликайте onSubmit зі зміненими даними
    // onSubmit(changedData);
    console.log(changedData);
  };

      function handleClose () {
    setOpenEditModal(false)
    setFormData(initialData)
  }


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
        <Modal open={openEditModal} onClose={handleClose}>
        <Box sx={modalStyles}>
            <form onSubmit={(e) => handleSubmit(e)}>
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

      <Button variant='contained' color='error' onClick={handleClose} sx={{mr: 2}}>Відміна</Button>
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