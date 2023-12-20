import Link from 'next/link'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const url = process.env.REACT_APP_SERVER_URL || ''
const gridStyle = {border: '1px solid lightgray', borderTop: 0 }

async function getData(params) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`${url}/api/goods?${queryParams}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    const clonedResponse = res.clone();
    const jsonData = await clonedResponse.json();
    return jsonData;
  } catch (error) {
    throw new Error('Не вдалось отримати дані');
  }
}

export default async function Goods({ searchParams }) {
  const goods = await getData(searchParams)

  const goodsAreasArray = goods?.map(good => good.goodArea) || []
  const goodsQtyArray = goods?.map(good => good.qty) || []
  const goodsQty = goodsQtyArray.reduce((total, num) => total + num, 0);
  const goodsArea = goodsAreasArray.reduce((total, num) => total + num, 0);

  return (
    <>
    <Box sx={{ position: 'relative' }}>
          <Link href='/goods/addNewGood'>
            <Fab
              sx={{ position: 'fixed', textTransform: 'none', opacity: '90%', right: { xs: 20, sm: 30, xl: '5%' }, bottom: { xs: 20, sm: 30, lg: 35 } }}
              color='primary' aria-label="Додати новий пост" variant='extended'> 
              Нова сіточка</Fab></Link>
      </Box>
      <Box sx={{ mx: 2, mb: 2 }}>
        <Typography sx={{display: 'flex', mb: 2, gap: 1}}> Загальна площа сіточок: <strong>{goodsArea} м²</strong>, Загальна кількість сіточок: <strong>{goodsQty} шт.</strong></Typography>
        <Grid container spacing={1} sx={{border: 1, position: 'sticky', top: 0, backgroundColor: 'white', m: 0}}>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Розмір
          </Grid>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Кіл-ть
          </Grid>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Сезон
          </Grid>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Площа
          </Grid>
          <Box component={Grid} item md={8} sx={{border: 1}} display={{ xs: 'none', md: 'block' }}>
            Кольори
          </Box>
        </Grid>
      <ol>
        {goods && goods.map(good => <li style={{fontSize: 13}} key={good._id}>
          <Grid container spacing={1} sx={{ display: 'flex', fontSize: '1rem', m: 0, border: '1px solid lightgray', borderTop: 0}}>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.a} x {good.b}</Grid>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.qty}</Grid>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.season}</Grid>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.goodArea} м²</Grid>
            <Grid item xs={12} md={8} sx={{display: 'flex'}}>
            <Typography display={{xs: 'block', md: 'none'}} sx={{mr: 1}}>Кольори: </Typography>
            {good.color?.map(color => (
          <Typography sx={{display: 'flex', gap: 1}} >
            {color.name}: {color.qty},
          </Typography>
        ))}
          </Grid>
        </Grid>
        </li>)}
      </ol>
      </Box>
    </>
  )
}