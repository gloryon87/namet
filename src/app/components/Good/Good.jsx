import React from 'react'
// import Link from 'next/link'
// import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

function Good({ good }) {

  return (
    <Box sx={{display: 'flex', width: '100%', flexWrap: 'wrap', gap: 1, pl: 1, pt: 1, fontSize: '15px'}}>
          <Typography sx={{fontSize: '15px'}}> ○ {`${good.a} x ${good.b} ${good.qty} шт. ${good.season} ${good.material}`}</Typography>
          <Typography sx={{fontSize: '15px'}}> Кольори: </Typography>
          {good.color?.map((color) => <Typography sx={{fontSize: '15px'}} key={color._id}>{color.name}: {color.qty},</Typography>)}
      <Typography sx={{ fontSize: '15px' }}> {good.production && `Виробництво: ${good.production} `}</Typography>
      <Typography sx={{ ml: 'auto' }}>{good.goodArea} кв.м.</Typography>
    </Box>
  )
}

export default Good
