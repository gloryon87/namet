import Link from 'next/link'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import GoodsSearch from '../components/goods/GoodsSearch/GoodsSearch'
import EditGood from '../components/goods/EditGood/EditGood'


const url = process.env.REACT_APP_SERVER_URL || ''

export const metadata = {
  title: 'Сіточки',
};

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

  if (res.ok) {
    const jsonData = await res.json();
    return jsonData;
  } else {
    throw new Error('Помилка сервера');
  }
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
    <Box sx={{ position: 'relative', backgroundColor: 'white' }}>
          <Link href='/goods/addNewGood'>
            <Fab
              sx={{ position: 'fixed', textTransform: 'none', opacity: '90%', right: { xs: 20, sm: 30, xl: '5%' }, bottom: { xs: 20, sm: 30, lg: 35 } }}
              color='primary' aria-label="Додати новий пост" variant='extended'> 
              Нова сіточка</Fab></Link>
      </Box>
      <Box sx={{ mx: 2, mb: 11 }}>
        <GoodsSearch/>
        <Typography color='primary' sx={{display: 'flex', mt: 3, mb: 2, gap: 1}}> <span>Загальна площа сіточок: <strong>{goodsArea} м²</strong> </span> <span> Загальна кількість сіточок: <strong>{goodsQty} шт.</strong> </span></Typography>
        <Grid container spacing={1} sx={{border: 1, position: 'sticky', top: 0, backgroundColor: 'white', m: 0}}>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Розмір
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1}}>
            Кіл-ть
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1}}>
            Сезон
          </Grid>
          <Grid item md={2} display={{ xs: 'none', md: 'block' }} sx={{border: 1}}>
            Матеріал
          </Grid>
          <Grid item xs={3} md={1} sx={{border: 1}}>
            Площа
          </Grid>
          <Grid item md={5} sx={{border: 1}} display={{ xs: 'none', md: 'block' }}>
            Кольори
          </Grid>
          <Grid item xs={2} md={1} sx={{border: 1, zIndex: 2000}}> </Grid>
        </Grid>
      <ol>
          {goods && goods.length > 0 && goods.map(good => <li style={{ fontSize: 13 }} key={good._id}>
          <Grid container spacing={1} sx={{ display: 'flex', fontSize: '1rem', m: 0, border: '1px solid lightgray', borderTop: 0}}>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.a} x {good.b}</Grid>
            <Grid item xs={2} md={1} sx={gridStyle}>{good.qty}</Grid>
            <Grid item xs={2} md={1} sx={gridStyle}>{good.season}</Grid>
            <Grid item md={2} display={{ xs: 'none', md: 'block' }} sx={gridStyle}>{good.material}</Grid>
            <Grid item xs={3} md={1} sx={gridStyle}>{good.goodArea} м²</Grid>
            <Grid display={{xs: 'flex', md: 'none'}} item xs={2} sx={{...gridStyle, justifyContent: 'center', alignItems: 'center', zIndex: 1}}><EditGood good={good} url={url} goodId={good._id}/></Grid>
            <Grid item xs={12} md={5} sx={gridStyle}>
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>  
                  <Typography display={{ xs: 'block', md: 'none' }}>{ good.material}. Кольори: </Typography>
              {good.color?.map(color => (
          <Typography key={color._id}>
            {color.name}: {color.qty},
          </Typography>
        ))}
        </Box>
            </Grid>
            <Grid item display={{xs: 'none', md: 'flex'}} xs={1} sx={{...gridStyle, justifyContent: 'center', alignItems: 'center'}}><EditGood good={good} url={url} goodId={good._id}/></Grid>
          </Grid>
        </li>)}
      </ol>
      </Box>
    </>
  )
}