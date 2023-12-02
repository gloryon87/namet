import React from 'react'
// import Link from 'next/link'
// import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

function Good({ good }) {

  return (
    <Box sx={{display: 'flex', width: '100%', flexWrap: 'wrap', border: '1px solid lightgrey', gap: 1, pl: 1, pt: 1, fontSize: '15px'}}>
      {/* <Grid container spacing={1} sx={{ m: 0, mt: 1, width: '100%' }}>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.a}
        </Grid>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.b}
        </Grid>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.qty}
        </Grid>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.season}
        </Grid>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.material}
        </Grid>
        <Grid item xs={4} md={2} sx={{ border: '1px solid grey' }}>
          {good?.production}
        </Grid>
      </Grid> */}
          <Typography sx={{fontSize: '15px'}}> ○ {`${good.a} x ${good.b} ${good.qty} шт. ${good.season} ${good.material}`}</Typography>
          <Typography sx={{fontSize: '15px'}}> Кольори: </Typography>
          {good.color?.map((color) => <Typography sx={{fontSize: '15px'}} key={color._id}>{color.name}: {color.qty},</Typography>)}
      <Typography sx={{ fontSize: '15px' }}> {`робить ${good.production} `}</Typography>
      <Typography sx={{ ml: 'auto' }}>{good.goodArea} кв.м.</Typography>
    </Box>
  )
}

export default Good
