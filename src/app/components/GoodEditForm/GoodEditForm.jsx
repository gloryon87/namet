'use client'
import React, { useState } from 'react'
import { colors, colorSchemes } from '@/app/variables'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

function GoodEditForm ({ formData, onFormChange, delivery = true }) {
  const currentScheme =
    formData.color.filter(color => color.qty > 0).length > 0
      ? { schemeName: 'Поточна схема', colors: formData.color }
      : null
  const initialColorScheme = currentScheme ? currentScheme : ''
  const [colorScheme, setColorScheme] = useState(initialColorScheme)

  const handleChange = e => {
    const { name, value } = e.target
    onFormChange({ ...formData, [name]: value })
  }

  const handleColorSchemeChange = e => {
    const { value } = e.target
    setColorScheme(value)
    onFormChange({ ...formData, color: value.colors })
  }

  const handleChangeColor = (name, qty) => {
    const prevColor = formData.color || []
    const existingColorIndex = prevColor.findIndex(color => color.name === name)

    if (existingColorIndex !== -1) {
      // Якщо кольор уже існує, змінюємо qty
      const updatedColor = [...prevColor]
      updatedColor[existingColorIndex] = { name, qty }
      onFormChange({ ...formData, color: updatedColor })
    } else {
      // Якщо кольору немає, додаємо новий кольор
      const updatedColor = [...prevColor, { name, qty }]
      onFormChange({ ...formData, color: updatedColor })
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1, mt: 2 }}>
        <Grid item xs={6} sm={4} lg={2}>
          <TextField
            label='Ширина, м.'
            name={'a'}
            value={formData.a || ''}
            onChange={e => handleChange(e)}
            type='number'
            error={8 < formData.a || formData.a < 2}
            helperText='*Введіть число від 2 до 8'
            InputProps={{ inputProps: { min: 2, max: 8 } }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <TextField
            label='Довжина, м.'
            name={'b'}
            value={formData.b || ''}
            onChange={e => handleChange(e)}
            type='number'
            error={12 < formData.b || formData.b < 4}
            helperText='*Введіть число від 4 до 12'
            InputProps={{ inputProps: { min: 4, max: 12 } }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <TextField
            label='Кількість'
            name={'qty'}
            value={formData.qty || ''}
            onChange={e => handleChange(e)}
            type='number'
            InputProps={{ inputProps: { min: 1 } }}
            error={formData.qty < 1}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <TextField
            disabled={!delivery}
            label='Видано'
            name={'delivered'}
            value={formData.delivered}
            onChange={e => handleChange(e)}
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
              value={formData.season || ''}
              onChange={e => handleChange(e)}
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
            value={formData.material}
            onChange={e => handleChange(e, index)}
            fullWidth
          />
        </Grid>
      </Grid>
      <FormControl sx={{ my: 3, width: 200 }}>
        <InputLabel>Кольорова схема*</InputLabel>
        <Select
          name={'colorScheme'}
          label='Кольорова схема'
          value={colorScheme}
          onChange={e => handleColorSchemeChange(e)}
          required
        >
          {colorSchemes?.map(colorScheme => (
            <MenuItem key={colorScheme.schemeName} value={colorScheme}>
              {colorScheme.schemeName}
            </MenuItem>
          ))}
          {colorScheme.schemeName === 'Поточна схема' && (
            <MenuItem value={colorScheme}>Поточна схема</MenuItem>
          )}
        </Select>
      </FormControl>
      {colorScheme && (
        <>
          <Typography variant='body2' sx={{ mb: 2 }}>
            <b>Кольори</b>
          </Typography>

          <Grid container spacing={2} sx={{ flexGrow: 1, mb: 2 }}>
            {colorScheme.schemeName === 'Своя схема' ||
            colorScheme.schemeName === 'Поточна схема'
              ? colors?.map(color => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={color}>
                    <TextField
                      label={color}
                      name={color}
                      value={
                        formData.color?.find(c => c.name === color)?.qty || ''
                      }
                      onChange={e => handleChangeColor(color, +e.target.value)}
                      type='number'
                      error={
                        formData.color?.find(c => c.name === color)?.qty < 0 ||
                        formData.color?.find(c => c.name === color)?.qty > 4
                      }
                      helperText='Число від 0 до 4'
                      InputProps={{ inputProps: { min: 0, max: 4 } }}
                      fullWidth
                    />
                  </Grid>
                ))
              : colors
                  ?.filter(
                    color =>
                      formData.color?.find(c => c.name === color)?.qty > 0
                  )
                  .map(color => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={color}>
                      <TextField
                        label={color}
                        name={color}
                        value={
                          formData.color?.find(c => c.name === color)?.qty
                        }
                        onChange={e =>
                          handleChangeColor(color, +e.target.value)
                        }
                        type='number'
                        fullWidth
                        disabled
                      />
                    </Grid>
                  ))}
          </Grid>
        </>
      )}
    </>
  )
}

export default GoodEditForm
