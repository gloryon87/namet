'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { modalStyles } from '../../../styles/modalStyles'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined'
import Good from '../../orders/Good/Good'
import { useRouter } from 'next/navigation'
import TextField from '@mui/material/TextField'
import calculateGoodsData from '@/app/utils/calculateGoodsData'

function MoveToWarehouse({ good, url, production, goodId }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const [qty, setQty] = useState(good.qty - (good.delivered || 0))
  const router = useRouter()
  const { goodsColor } = calculateGoodsData([good])
  const productionId = production._id
  console.log(goodId)


  const productionMaterials = production.materials.map(material => {
    const matchingGood = goodsColor.find(color => color.name === material.color)

    if (matchingGood) {
      const difference =
        material.qty - (matchingGood.colorArea / good.qty) * qty
      return {
        color: material.color,
        qty: difference
      }
    }

    // If there is no matching color in goodsColor, return the original material
    return {
      color: material.color,
      qty: material.qty
    }
  })

  function handleClose () {
    setQty(good.qty - (good.delivered || 0))
    setOpenModal(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // Запит на оновлення товару на виробництві
      const updateGood = fetch(
        `${url}/api/production/${productionId}/goods/${goodId}`,
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            ...good,
            delivered: Number(good.delivered) + Number(qty),
            materials: productionMaterials
          })
        }
      )

      const updateProduction = fetch(`${url}/api/production/${productionId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          ...production,
          materials: productionMaterials
        })
      })

      // Запит на додавання товару на склад
      const updateStock = fetch(`${url}/api/goods`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          ...good,
          qty: +qty,
          colorCode: good.color.map(color => `${color.name}:${color.qty}`)
  .join(', ')

        })
      })

      // Виконання усіх запитів паралельно
      const [resGoodInProduction, resStock, resProduction] = await Promise.all([
        updateGood,
        updateStock,
        updateProduction
      ])

      if (!resGoodInProduction.ok) {

        throw new Error(
          `Не вдалось оновити товар на виробництві! УВАГА! Товар міг додатись на склад та оновитись матеріали`
        )
      }

      if (!resStock.ok) {
        throw new Error(
          `Не вдалось додати товар на склад. УВАГА! Виробництво могло оновитись!`
        )
      }

      if (!resProduction.ok) {
        throw new Error(
          `Не вдалось оновити матеріали.`
        )
      }

      // Оновлюємо сторінку

      handleClose()
      router.refresh()
      return resGoodInProduction.json() // Повертаємо результат першого запиту
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Modal open={openModal} onClose={handleClose}>
          <Box sx={modalStyles}>
            <Box
              component='form'
              onSubmit={e => handleSubmit(e)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}
            >
              <Typography color='primary'>
                Перемістити сіточки на склад
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Good good={good} />
                <TextField
                  label='Кількість'
                  name={'qty'}
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                  type='number'
                  InputProps={{ inputProps: { min: 1, max: good.qty - (good.delivered || 0) } }}
                  sx={{minWidth: '100px'}}
                  required
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: { xs: 0, lg: 2 }
                }}
              >
                <Button
                  variant='outlined'
                  color='error'
                  onClick={handleClose}
                  sx={{ mr: 2 }}
                >
                  Відміна
                </Button>
                <Button variant='outlined' color='primary' type='submit'>
                  Перемістити
                </Button>
              </Box>
              {error && (
                <Typography variant='h4' color='error'>
                  {error}
                </Typography>
              )}
              {loading && (
                <Typography variant='h6' color='primary'>
                  попийте чайок...
                </Typography>
              )}
            </Box>
          </Box>
        </Modal>

        <Button color='primary' onClick={() => setOpenModal(true)}>
          <Tooltip title='Перемістити сіточки на склад'>
            <ShoppingCartCheckoutOutlinedIcon />
          </Tooltip>
        </Button>
      </Box>
    </>
  )
}

export default MoveToWarehouse
