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
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'
import { modalStyles } from '../../../styles/modalStyles'
import DeleteModal from '../../DeleteModal/DeleteModal'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import formatDate from '@/app/utils/formatDate'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function OrderControlBar ({ order, url }) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const formatToISOString = dateString => {
    if (!dateString || dateString === 'NaN-NaN-NaN') {
      return null
    }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toISOString()
  }

  const initialData = {
    ...order,
    date: formatDate(order.date),
    deadline: formatDate(order.deadline),
    goods: null
  }
  const [formData, setFormData] = useState(initialData)

  const handleChange = e => {
    const { name, value } = e.target
    const formattedValue =
      name === 'date' || name === 'deadline'
        ? formatDate(new Date(value))
        : value
    setFormData({ ...formData, [name]: formattedValue })
  }

  function handleClose () {
    setError(null)
    setOpenEditModal(false)
    setFormData(() => initialData)
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Отримайте змінені дані
    const changedData = Object.keys(formData)?.reduce((result, key) => {
      if (formData[key] !== initialData[key]) {
        result[key] =
          key === 'date' || key === 'deadline'
            ? formatToISOString(formData[key])
            : formData[key]
      }
      return result
    }, {})

    // Викликайте onSubmit зі зміненими даними
    Object.keys(changedData).length > 0
      ? handleEdit(changedData)
      : handleClose()
  }

  function handleDeleteModalClose () {
    setError(null)
    setOpenDeleteModal(false)
  }

  // API

  // Delete the order

  async function handleDelete () {
    try {
      setError(null)
      const res = await fetch(`${url}/api/orders/${order._id}`, {
        method: 'DELETE',
        headers: fetchParamsClient.headers
      })
      if (res.ok) {
        router.push('/orders')
        router.refresh()
        setOpenDeleteModal(false)
      }
      return res.json()
    } catch (error) {
      if (error instanceof TypeError) {
        return setError(
          "Виникла помилка мережі. Будь ласка, перевірте з'єднання з Інтернетом."
        )
      }
      setError(
        'Не вдалось видалити замовлення. Будь ласка, спробуйте знову пізніше.'
      )
    }
  }

  // Edit order

  async function handleEdit (editBody) {
    try {
      setError(null)
      const res = await fetch(`${url}/api/orders/${order._id}`, {
        method: 'PUT',
        headers: fetchParamsClient.headers,
        body: JSON.stringify(editBody)
      })
      router.refresh()
      return res.json()
    } catch (error) {
      setError('Не вдалось відредагувати замовлення')
    } finally {
      setOpenEditModal(false)
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Modal open={openEditModal} onClose={handleClose}>
          <Box
            component='form'
            onSubmit={e => handleSubmit(e)}
            sx={modalStyles}
          >
            <Typography variant='h6' component='h2' sx={{ mb: 2 }}>
              Редагувати замовлення
            </Typography>
            <Grid
              container
              rowSpacing={{ xs: 0, md: 1 }}
              columnSpacing={{ xs: 1, md: 2 }}
              sx={{ mb: 2 }}
            >
              <Grid item xs={12}>
                <TextField
                  label='Замовник'
                  name='contacts'
                  type='text'
                  value={formData.contacts}
                  onChange={e => handleChange(e)}
                  fullWidth
                  margin='normal'
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  label='Дата замовлення'
                  name='date'
                  type='date'
                  value={formData.date}
                  onChange={e => handleChange(e)}
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  margin='normal'
                />
              </Grid>

              {/* Deadline */}
              <Grid item xs={12} md={6}>
                <TextField
                  label='Дедлайн'
                  name='deadline'
                  type='date'
                  value={
                    formData.deadline !== '1970-01-01'
                      ? formData.deadline
                      : formatDate(new Date())
                  }
                  onChange={e => handleChange(e)}
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  margin='normal'
                />
              </Grid>

              {/* Info */}
              <Grid item xs={12}>
                <TextField
                  label='Коментар'
                  name='info'
                  type='text'
                  value={formData.info}
                  onChange={e => handleChange(e)}
                  fullWidth
                  multiline
                  rows={4}
                  margin='normal'
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Стан</InputLabel>
                  <Select
                    label='Стан'
                    name='state'
                    type='text'
                    value={formData.state}
                    onChange={e => handleChange(e)}
                  >
                    <MenuItem value='прийнято'>Прийнято</MenuItem>
                    <MenuItem value='в роботі'>В роботі</MenuItem>
                    <MenuItem value='виконано'>Виконано</MenuItem>
                    <MenuItem value='відміна'>Відміна</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Priority */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Пріоритет</InputLabel>
                  <Select
                    label='Пріоритет'
                    name='priority'
                    type='text'
                    value={formData.priority}
                    onChange={e => handleChange(e)}
                  >
                    <MenuItem value='вис.'>Високий</MenuItem>
                    <MenuItem value='норм.'>Нормальний</MenuItem>
                    <MenuItem value='низ.'>Низький</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='outlined'
                color='error'
                onClick={handleClose}
                sx={{ mr: 2, mb: 1 }}
              >
                Відміна
              </Button>
              <Button
                type='submit'
                variant='outlined'
                color='primary'
                sx={{ mb: 1 }}
              >
                Зберегти
              </Button>
            </Box>
          </Box>
        </Modal>

        <DeleteModal
          open={openDeleteModal}
          onClose={handleDeleteModalClose}
          onConfirm={handleDelete}
        />

        <Tooltip title='Редагувати замовлення'>
          <Button onClick={() => setOpenEditModal(true)}>
            <EditOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title='Видалити замовлення'>
          <Button color='error' onClick={() => setOpenDeleteModal(true)}>
            <DeleteForeverOutlinedIcon />
          </Button>
        </Tooltip>
      </Box>
      {error && (
        <Typography variant='h4' color='error'>
          {error}
        </Typography>
      )}
    </>
  )
}

export default OrderControlBar
