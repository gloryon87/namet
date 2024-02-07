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
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useRouter } from 'next/navigation'
import formatDate from '@/app/utils/formatDate'
import GoodEditForm from '../../GoodEditForm/GoodEditForm.jsx'
import { fetchParamsClient } from '@/app/API/fetchParamsClient.js'

function AddOrderForm ({ url, colors, colorSchemes }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const initialFormData = {
    date: new Date(),
    goods: [{ material: 'спанбонд' }],
    deadline: '',
    state: 'прийнято',
    priority: 'норм.'
  }
  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()

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

  const handleGoodChange = (newGood, index) => {
    const updatedGoods = [...formData.goods]
    updatedGoods[index] = newGood
    setFormData({ ...formData, goods: updatedGoods })
  }

  const handleAddGood = () => {
    const updatedGoods = [...formData.goods]
    updatedGoods.push({ material: 'спанбонд' })
    setFormData(prevData => ({ ...prevData, goods: updatedGoods }))
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
        500
    })
  }

  const handleDeleteGood = index => {
    const updatedGoods = [...formData.goods]
    updatedGoods.splice(index, 1)
    setFormData(prevData => ({ ...prevData, goods: updatedGoods }))
  }

  async function handleSubmit (e) {
    e.preventDefault()
    const updatedGoodsColorData = formData.goods.map(good => ({
      ...good,
      color: good.color?.filter(color => color.qty > 0)
    }))
    const stringifiedDate = formatToISOString(formData.date)
    const stringifiedDeadline = formatToISOString(formData.deadline)

    if (formData.goods.some(good => !good.color || good.color.length === 0)) {
      return setError('Оберіть хоча б один колір для кожного товару')
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${url}/api/orders`, {
        method: 'POST',
        headers: fetchParamsClient.headers,
        body: JSON.stringify({
          ...formData,
          goods: updatedGoodsColorData,
          date: stringifiedDate,
          deadline: stringifiedDeadline
        })
      })
      const data = await res.json()
      const orderId = data.orderId

      if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`)
      }
      router.refresh()
      router.push(`/orders/${orderId}`)
    } catch (error) {
      console.error('Помилка:', error)
      if (error instanceof TypeError) {
        return setError(
          "Виникла помилка мережі. Будь ласка, перевірте з'єднання з Інтернетом."
        )
      }
      if (error instanceof SyntaxError) {
        return setError('Отримано неправильний формат даних від сервера.')
      }
      setError(
        'Не вдалось додати замовлення. Будь ласка, спробуйте знову пізніше.'
      )
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}
              >{`Товар №${index + 1}`}</Typography>
              <Tooltip title='Видалити товар'>
                <Button
                  color='error'
                  onClick={e => setTimeout(() => handleDeleteGood(index), 500)}
                >
                  <DeleteForeverOutlinedIcon />
                </Button>
              </Tooltip>
            </Box>
            <GoodEditForm
              formData={good}
              onFormChange={newGood => handleGoodChange(newGood, index)}
              colors={colors}
              colorSchemes={colorSchemes}
            />
          </Box>
        ))}

        <Button color='primary' onClick={handleAddGood}>
          <AddIcon />
          Додати товар
        </Button>

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
        >
          <Button
            variant='outlined'
            color='error'
            onClick={() => router.push('/orders')}
          >
            Вийти
          </Button>
          <Button variant='outlined' color='primary' type='submit'>
            Зберегти
          </Button>
        </Box>
      </Box>
      {error && (
        <Typography variant='h5' color='error' align='center'>
          {error}
        </Typography>
      )}
      {loading && (
        <Typography variant='h6' color='primary' align='center'>
          попийте чайок...
        </Typography>
      )}
    </>
  )
}

export default AddOrderForm
