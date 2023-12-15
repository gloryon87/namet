import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

function Good({ good }) {

  return (
    <Box sx={{display: 'flex', width: '100%'}}>
    <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 1, pl: 1, pt: 1, mr: 1, fontSize: '15px' }}>
          <Typography sx={{fontSize: '15px'}}> ○ <strong>{good.a} x {good.b} </strong> - {good.qty} шт. {good.season} {good.material}</Typography>
          <Typography sx={{fontSize: '15px'}}> <strong>Кольори:</strong> </Typography>
          {good.color?.map((color) => <Typography sx={{fontSize: '15px'}} key={color._id}>{color.name}: {color.qty},</Typography>)}
      <Typography sx={{ fontSize: '15px' }}> <strong>{good.production && 'Виробництво:'}</strong> {good.production}</Typography>
    </Box>
    <Typography align='center' color='primary' sx={{ display: 'flex', mr: 1, ml: 'auto', alignItems: 'center', justifyContent: 'center', width: '4rem' }}>{good.goodArea} м²</Typography>
    </Box>
  )
}

export default Good
