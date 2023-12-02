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
            <Box sx={modalStyles}>
            <Typography align='center' gutterBottom color='primary'>Точно видалити?</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Button variant='contained' onClick={onClose}>Ні</Button>
            <Button variant='contained' color='error' onClick={onConfirm}>Так</Button>
            </Box>
            </Box>
        </Modal>
  )
}

export default DeleteModal

