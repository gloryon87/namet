'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import DeleteModal from '../../DeleteModal/DeleteModal'
import { useRouter } from 'next/navigation'
import { fetchParamsClient } from '@/app/API/fetchParamsClient'

function GoodsEditComponent ({ orderId, goodId, url }) {
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleRemoveGood () {
    try {
      setError(null)
      const res = await fetch(
        `${url}/api/orders/${orderId}/remove-good/${goodId}`,
        { method: 'PUT', headers: fetchParamsClient.headers }
      )
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      setError('Не вдалось видалити товар')
    } finally {
      setOpenModal(false)
    }
  }

  function handleClose () {
    setOpenModal(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <DeleteModal
          open={openModal}
          onClose={handleClose}
          onConfirm={handleRemoveGood}
        />

        <Button color='error' onClick={() => setOpenModal(true)}>
          <Tooltip title='Видалити товар'>
            <DeleteForeverOutlinedIcon />
          </Tooltip>
        </Button>
      </Box>
      {error && (
        <Typography variant='h4' color='error'>
          {error}
        </Typography>
      )}
    </>
  )
}

export default GoodsEditComponent
