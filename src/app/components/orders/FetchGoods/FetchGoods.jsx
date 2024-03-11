'use client'
import React from 'react'
import useSWR from 'swr'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function FetchGoods ({ url, good, qty, setQty, selectedGood, setSelectedGood }) {
  const remainder = good.qty - good.delivered || good.qty
  const fetcher = (url, options) => {
    options = fetchParamsClient
    return fetch(url, options).then(res => res.json())
  }

  const { data, error } = useSWR(
    `${url}/api/goods?a=${good.a}&b=${good.b}`,
    fetcher
  )
  if (error) return <Typography>не вийшло завантажити дані</Typography>
  if (!data) return <Typography>попийте чайок...</Typography>
  
  const handleQtyChange = e => {
    const { value } = e.target
    setQty(value)
  }

  const handleGoodChange = e => {
    const { value } = e.target
    setSelectedGood(value)
    value.qty >= remainder ? setQty(remainder) : setQty(value.qty)
  }

  return (
    <>
      <Typography>
        {' '}
        Залишилось видати <strong>{remainder} шт.</strong>{' '}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', lg: 'row' }
        }}
      >
        <FormControl fullWidth>
          <InputLabel id='good-label'>Оберіть товар зі складу</InputLabel>
          <Select
            labelId='good-label'
            name='good'
            id='good-select'
            value={selectedGood}
            label='Оберіть товар зі складу'
            onChange={handleGoodChange}
            required
          >
            {data?.filter(good => good.qty > 0).length > 0 &&
              data.map(good => (
                <MenuItem value={good} sx={{ display: 'flex' }} key={good._id}>
                  {' '}
                  <Typography>
                    {good.a} x {good.b} - {good.qty} шт. {good.season}{' '}
                    {good.material}. Код: {good.code}. Кольори:{' '}
                  </Typography>{' '}
                  {good.color?.map(color => (
                    <Typography key={color._id}>
                      {color.name}: {color.qty},
                    </Typography>
                  ))}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label='Кількість'
          name={'qty'}
          value={qty}
          onChange={handleQtyChange}
          type='number'
          InputProps={{ inputProps: { min: 1, max: selectedGood.qty } }}
          sx={{ maxWidth: 150 }}
          fullWidth
          required
        />
      </Box>
      {data?.filter(good => good.qty > 0).length === 0 && (
        <Typography sx={{ ml: 2 }} color='error'>
          {' '}
          На жаль, на складі немає сіток такого розміру{' '}
        </Typography>
      )}
    </>
  )
}

export default FetchGoods
