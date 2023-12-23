'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useRouter } from 'next/navigation'
import { colors } from '../../../variables.js'

function AddOrderForm({url}) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const initialFormData = { date: new Date(), goods: [{material: 'спанбонд'}], deadline: '', state: 'прийнято', priority: 'норм.' }
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

  const formatDate = dateString => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatToISOString = dateString => {
    if (dateString == '') {
      return ''
    }
    const date = new Date(dateString)
    return date.toISOString()
  }

  const handleChange = e => {
    const { name, value } = e.target
    const formattedValue =
      name === 'date' || name === 'deadline'
        ? formatDate(new Date(value))
        : value
    setFormData({ ...formData, [name]: formattedValue })
  }

  const handleChangeGood = (e, index) => {
    const { name, value } = e.target
    // Create a copy of the goods array
    const updatedGoods = [...formData.goods]
    // Update the specific good in the copy
    updatedGoods[index] = { ...updatedGoods[index], [name]: value }
    // Update the formData with the new goods array
    setFormData({ ...formData, goods: updatedGoods })
  }

  const handleCancel = () => {
    setFormData(initialFormData)
  }

const handleSelectColor = (name, value, index) => {
  setFormData((prevData) => {
    const prevGoods = prevData.goods || [];

    const updatedGoods = prevGoods.map((good, i) => {
      // Check if the current good is the one at the specified index
      if (i === index) {
        const prevColor = good.color || [];

        if (value === 0) {
          // If value is 0, remove the color with the specified name
          return {
            ...good,
            color: prevColor.filter((color) => color.name !== name),
          };
        }

        const existingColor = prevColor.find((color) => color.name === name);

        if (existingColor) {
          // If color already exists, update its quantity
          existingColor.qty = +value;
        } else {
          // If color doesn't exist, add a new color
          const updatedColor = { name, qty: +value };
          prevColor.push(updatedColor);
        }

        return { ...good, color: prevColor };
      }

      // For goods other than the one at the specified index, return as is
      return good;
    });

    return { ...prevData, goods: updatedGoods };
  });
};


const handleAddGood = () => {
  const updatedGoods = [...formData.goods];
  updatedGoods.push({material: 'спанбонд'});
  setFormData((prevData) => ({ ...prevData, goods: updatedGoods }));
  setTimeout(() => {window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"}), 500})
};

  const handleDeleteGood = (index) => {
  const updatedGoods = [...formData.goods];
  updatedGoods.splice(index, 1)
  setFormData((prevData) => ({ ...prevData, goods: updatedGoods }));
};

  async function handleSubmit (e) {
    e.preventDefault()
    const updatedGoodsColorData = formData.goods.map(good => ({
      ...good,
      color: good.color?.filter(color => color.qty > 0)
    }))
    const stringifiedDate = formatToISOString(formData.date)
    const stringifiedDeadline = formatToISOString(formData.deadline)

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${url}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, goods: updatedGoodsColorData, date: stringifiedDate, deadline: stringifiedDeadline })
      })
      const data = await res.json();
      const orderId = data.orderId;

      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      router.push(`/orders/${orderId}`)
    } catch (error) {
      // setError('Не вдалось додати замовлення')
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Додати нове замовлення
      </Typography>
      <Box component='form' onSubmit={handleSubmit}>
        <Typography variant='h6' sx={{ mt: 2 }}>
          Загальна інформація
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} sm={12} lg={4}>
            <TextField
              label='Замовник'
              name='contacts'
              type='text'
              value={formData.contacts || ''}
              onChange={handleChange}
              fullWidth
              margin='normal'
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label='Дата замовлення'
              name='date'
              type='date'
              value={formatDate(new Date(formData.date))}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              margin='normal'
              required
            />
          </Grid>
          <Grid item xs={6} md={3} lg={2}>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Стан</InputLabel>
              <Select
                label='Стан'
                name='state'
                value={formData.state}
                onChange={handleChange}
                required
              >
                <MenuItem value='прийнято'>Прийнято</MenuItem>
                <MenuItem value='в роботі'>В роботі</MenuItem>
                <MenuItem value='виконано'>Виконано</MenuItem>
                <MenuItem value='відміна'>Відміна</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3} lg={2}>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Пріоритет</InputLabel>
              <Select
                label='Пріоритет'
                name='priority'
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value='вис.'>Високий</MenuItem>
                <MenuItem value='норм.'>Нормальний</MenuItem>
                <MenuItem value='низ.'>Низький</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              label='Дедлайн'
              name='deadline'
              type='date'
              value={formData.deadline || ''}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              margin='normal'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Коментар'
              name='info'
              type='text'
              value={formData.info || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin='normal'
            />
          </Grid>
        </Grid>
        <Typography variant='h6' sx={{ mt: 2, mb: 1 }}>
          Товари
        </Typography>
        {formData.goods.map((good, index) => (
          <Box key={index}>
            <Box sx={{display: 'flex', gap: 2, mb: 1}}>
            <Typography sx={{display: 'flex', alignItems: 'center', fontWeight: 600}}>{`Товар №${index + 1}`}</Typography>
            <Button color='error' onClick={e => setTimeout(() => handleDeleteGood(index), 500)}><DeleteForeverOutlinedIcon/></Button>
            </Box>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={6} sm={4} lg={2}>
                <TextField
                  label='Ширина, м.'
                  name={'a'}
                  value={good.a || ''}
                  onChange={e => handleChangeGood(e, index)}
                  type='number'
                  InputProps={{ inputProps: { min: 2, max: 8 } }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <TextField
                  label='Довжина, м.'
                  name={'b'}
                  value={good.b || ''}
                  onChange={e => handleChangeGood(e, index)}
                  type='number'
                  InputProps={{ inputProps: { min: 4, max: 16 } }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <TextField
                  label='Кількість'
                  name={'qty'}
                  value={good.qty || ''}
                  onChange={e => handleChangeGood(e, index)}
                  type='number'
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                  required
                />
              </Grid>
               <Grid item xs={6} sm={4} lg={2}>
                <TextField
                  label='Видано'
                  name={'delivered'}
                  value={formData.delivered}
                  onChange={e => handleChangeGood(e, index)}
                  type='number'
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <FormControl fullWidth>
                  <InputLabel>Сезон *</InputLabel>
                  <Select
                    name={'season'}
                    label='Сезон'
                    value={good.season || ''}
                    onChange={e => handleChangeGood(e, index)}
                    required
                  >
                    <MenuItem value='весна'>Весна</MenuItem>
                    <MenuItem value='літо'>Літо</MenuItem>
                    <MenuItem value='осінь'>Осінь</MenuItem>
                    <MenuItem value='зима'>Зима</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <TextField
                  label='Матеріал'
                  name={'material'}
                  value={good.material}
                  onChange={e => handleChangeGood(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Виробники'
                  name={'production'}
                  value={good.production || ''}
                  onChange={e => handleChangeGood(e, index)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography variant='body2' sx={{ mt: 2, mb: 2 }}>
              Кольори
            </Typography>
            <Grid container spacing={2} sx={{ flexGrow: 1, mb: 2 }}>
              {colors?.map(color => (
                <Grid item xs={6} md={3} lg={2} key={color}>
                  <TextField
                    label={color}
                    name={color}
                    value={good.color?.find(c => c.name === color)?.qty || 0}
                    onChange={e => handleSelectColor(color, +e.target.value, index)}
                    type='number'
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Button color='primary' onClick={handleAddGood}>
          Додати товар
        </Button>

        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2}}>
        <Button
          variant='outlined'
          color='error'
          onClick={handleCancel}
        >
          Скинути
        </Button>
        <Button variant='outlined' color='primary' type='submit'>
          Зберегти
        </Button>
        </Box>
      </Box>
      {error && (
        <Typography variant='h5' color='error'>
          {error}
        </Typography>
      )}
      {loading && (
        <Typography variant='h6' color='primary'>
          попийте чайок...
        </Typography>
      )}
    </>
  )
}

export default AddOrderForm