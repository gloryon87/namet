'use client'
import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { modalStyles } from '../../styles/modalStyles'

function DeleteModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyles, maxWidth: 200 }}>
            <Typography align='center' gutterBottom color='primary'>Точно видалити?</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Button variant='outlined' onClick={onClose}>Ні</Button>
            <Button variant='outlined' color='error' onClick={onConfirm}>Так</Button>
            </Box>
            </Box>
        </Modal>
  )
}

export default DeleteModal


