import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

const typographyStyle = { display: 'flex', alignItems: 'center', columnGap: 1 }

function Good ({ good }) {
  const delivered = good.delivered || 0
  const isDelivered = delivered >= good.qty

  return (
    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', ml: 1 }}>
      {isDelivered ? (
            <CheckCircleOutlinedIcon color='success' sx={{ fontSize: 20}} /> 
          ) : (
              <RadioButtonUncheckedOutlinedIcon
                sx={{ fontSize: 20, color: delivered > 0 ? '#388e3c' : 'lightgrey' }}
            /> 
        )}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          columnGap: 1,
          pl: 1,
          mr: 1
        }}
      >  
        <Typography sx={typographyStyle}>
          <strong>
            {good.a} x {good.b}
          </strong> - видано {delivered}/{good.qty} шт. {good.season} {good.material}
        </Typography>
        <Typography sx={typographyStyle}>
          <strong>Кольори:</strong>
        </Typography>
        {good.color?.map(color => (
          <Typography sx={typographyStyle} key={color._id}>
            {color.name}: {color.qty},
          </Typography>
        ))}
        <Typography sx={typographyStyle}>
          <strong>{good.production && 'Виробництво:'}</strong> {good.production}
        </Typography>
      </Box>
      <Typography
        align='center'
        color='primary'
        sx={{
          display: 'flex',
          mr: 1,
          ml: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          width: '4rem'
        }}
      >
        {good.goodArea} м²
      </Typography>
    </Box>
  )
}

export default Good
