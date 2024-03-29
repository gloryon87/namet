import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import EditGood from '../EditGood/EditGood'
import Link from 'next/link'

const gridStyle = { border: '1px solid lightgray', borderTop: 0 }
const url = process.env.REACT_APP_SERVER_URL || ''

function GoodItem ({ good, colors, colorSchemes }) {
  return (
    <li style={{ fontSize: 13 }}>
      <Grid
        container
        spacing={1}
        sx={{
          display: 'flex',
          fontSize: '1rem',
          m: 0,
          border: 1,
          borderTop: 0,
          width: 'auto'
        }}
      >
        <Grid item xs={3} md={1} sx={gridStyle}>
          {good.a} x {good.b}
        </Grid>
        <Grid item xs={2} md={1} sx={gridStyle}>
          {good.qty}
        </Grid>
        <Grid item xs={2} md={1} sx={gridStyle}>
          {good.code}
        </Grid>
        <Grid
          item
          xs={2}
          md={1}
          sx={gridStyle}
          display={{ xs: 'none', md: 'block' }}
        >
          {good.season}
        </Grid>
        <Grid item md={2} display={{ xs: 'none', md: 'block' }} sx={gridStyle}>
          {good.material}
        </Grid>
        <Grid item xs={3} md={1} sx={gridStyle}>
          {good.goodArea} м²
        </Grid>
        <Grid
          display={{ xs: 'flex', md: 'none' }}
          item
          xs={2}
          sx={{
            ...gridStyle,
            justifyContent: 'center',
            alignItems: 'center',
            p: 0
          }}
        >
          <EditGood
            good={good}
            url={url}
            goodId={good._id}
            colors={colors}
            colorSchemes={colorSchemes}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={gridStyle}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography display={{ xs: 'block', md: 'none' }}>
              <strong>Матеріал:</strong> {good.material}.{' '}
              <strong>Кольори:</strong>
            </Typography>
            {good.color?.map(color => (
              <Typography key={color._id}>
                {color.name}: {color.qty},
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid
          item
          display={{ xs: 'none', md: 'flex' }}
          xs={1}
          sx={{ ...gridStyle, justifyContent: 'center', alignItems: 'center' }}
        >
          <EditGood
            good={good}
            url={url}
            goodId={good._id}
            colors={colors}
            colorSchemes={colorSchemes}
          />
        </Grid>
        {good.deliveries.length > 0 && (
          <Grid item xs={12} sx={{ ...gridStyle, display: 'flex', gap: 2 }}>
            <Typography>
              <strong>Видачі:</strong>{' '}
            </Typography>
            {good.deliveries?.map(del => (
              <Box key={del._id} sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={del.orderContacts}>
                  <Link target='_blank' href={`/orders/${del.orderId}`}>
                    <Typography sx={{ '&:hover': { color: 'blue' } }}>
                      {del.date} {del.qty} шт.
                    </Typography>
                  </Link>
                </Tooltip>{' '}
                /
              </Box>
            ))}
          </Grid>
        )}
      </Grid>
    </li>
  )
}

export default GoodItem
