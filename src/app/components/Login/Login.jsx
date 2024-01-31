'use client'
import React, { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

function Login ({ url }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const loginFunction = async (login, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(url + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: login,
          password: password
        })
      })

      if (!response.ok) {
        handleReset()
        setError('Невірні дані для входу')
      }

      const { token } = await response.json()

      // Зберегти токен в куках
      setCookie('token', token, {
        path: '/',
        HttpOnly: 'true',
        Secure: 'true',
        SameSite: 'Strict'
      })
      router.refresh()

      // Інші дії після входу, якщо потрібно
    } catch (error) {
      console.error('Помилка при вході:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    loginFunction(login, password)
  }

  const handleReset = () => {
    setLogin('')
    setPassword('')
  }

  const handleLoginChange = e => {
    setLogin(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        mt: 5
      }}
    >
          <Box
            component='form'
            autoComplete='off'
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 500,
              alignItems: 'center'
            }}
          >
            <TextField
              label='Імʼя'
              name={'login'}
              value={login}
              onChange={handleLoginChange}
              autoComplete='off'
              fullWidth
              required
            />
            <TextField
              label='Пароль'
              name={'password'}
              value={password}
              type={'password'}
              onChange={handlePasswordChange}
              fullWidth
              autoComplete='new-password'
              required
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleReset} color='error' variant='outlined'>
                Скинути
              </Button>
              <Button type='submit' variant='outlined'>
                Увійти
              </Button>
            </Box>
          </Box>
      {error && <Typography color='error'>{error}</Typography>}
      {loading && <Typography>попийте чайок...</Typography>}
    </Box>
  )
}

export default Login
