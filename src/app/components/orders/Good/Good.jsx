import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

const typographyStyle = {
  display: 'flex',
  alignItems: 'center',
  columnGap: 1,
  flexWrap: 'wrap'
}

function Good ({ good }) {
  const delivered = good.delivered || 0
  const isDelivered = delivered >= good.qty

  return (
    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', p: 1 }}>
      {isDelivered ? (
        <CheckCircleOutlinedIcon color='success' sx={{ fontSize: 20 }} />
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
        <Typography sx={{ ...typographyStyle, width: '6ch' }}>
          <strong>
            {good.a} x {good.b}
          </strong>{' '}
        </Typography>
        <Typography sx={typographyStyle}>
          Видано {delivered}/{good.qty} шт. {good.season} {good.material}.
        </Typography>
        {good.code && (
          <Typography sx={typographyStyle}>
            <strong>Код:</strong> {good.code}
          </Typography>
        )}
        <Typography sx={typographyStyle}>
          <strong>Кольори:</strong>
        </Typography>
        {good.color?.map(color => (
          <Typography sx={typographyStyle} key={color.name}>
            {color.name}: {color.qty},
          </Typography>
        ))}
      </Box>
      <Typography
        align='center'
        sx={{
          display: 'flex',
          mr: 1,
          ml: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10ch'
        }}
      >
        {good.a * good.b * good.qty} м²
      </Typography>
    </Box>
  )
}

export default Good
