import Typography from '@mui/material/Typography'
import AddMaterial from '../components/materials/AddMaterial/AddMaterial'
import Grid from '@mui/material/Grid'
import TransferMaterial from '../components/materials/TransferMaterial/TransferMaterial'
import EditMaterial from '../components/materials/EditMaterial/EditMaterial'
import { Box } from '@mui/material'
import { fetchParamsServer } from '../API/fetchParamsServer'
import resHandler from '../API/resHandler'
import fetchProductionsList from '../API/fetchProductionsList'
import fetchColors from '../API/fetchColors'
import { redirect } from 'next/navigation'


// Metadata

export const metadata = {
  title: 'Матеріали'
}

const url = process.env.REACT_APP_SERVER_URL || ''
const gridStyle = { border: '1px solid lightgray', borderTop: 0 }

async function getData () {
  const fetchParams = fetchParamsServer()
  try {
    const res = await fetch(`${url}/api/materials`, fetchParams)
    return await resHandler(res)
  } catch (error) {
    if (error.message === 'Помилка валідації') {
      redirect('/')
    }
    throw new Error(error.message)
  }
}

export default async function Materials () {
  const colors = await fetchColors()
  const productions = await fetchProductionsList()
  const materials = await getData()
  const filteredMaterials = materials?.filter(material => material.qty > 0)
  const materilsQtyArray = materials?.map(material => material.qty)
  const materialsQty = materilsQtyArray?.reduce((a, b) => a + b, 0)

  return (
    <>
      <Typography variant='h5'>Матеріали</Typography>
      <Box
        sx={{
          display: 'flex',
          columnGap: 2,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 1,
          mt: 2
        }}
      >
        <Typography
          color='primary'
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
        >
          Загальна площа матеріалів: <strong>{materialsQty} м²</strong>{' '}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <AddMaterial url={url} colors={colors} />
          <TransferMaterial
            url={url}
            materials={filteredMaterials}
            productions={productions}
          />
        </Box>
      </Box>

      <Grid
        container
        spacing={1}
        sx={{
          border: 1,
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          m: 0,
          width: 'auto'
        }}
      >
        <Grid item xs={4} sx={{ border: 1 }}>
          Колір
        </Grid>
        <Grid item xs={4} sx={{ border: 1 }}>
          Матеріал
        </Grid>
        <Grid item xs={2} md={3} sx={{ border: 1 }}>
          Кіл-ть, м²
        </Grid>
        <Grid item xs={2} md={1} sx={{ border: 1, zIndex: 2000 }}>
          {' '}
        </Grid>
      </Grid>
      {materials?.map(material => (
        <Grid
          key={material._id}
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
          <Grid item xs={4} sx={gridStyle}>
            {material.color}
          </Grid>
          <Grid item xs={4} sx={gridStyle}>
            {material.material}
          </Grid>
          <Grid item xs={2} md={3} sx={gridStyle}>
            {material.qty}
          </Grid>
          <Grid
            item
            xs={2}
            md={1}
            sx={{ ...gridStyle, display: 'flex', justifyContent: 'center' }}
          >
            <EditMaterial
              material={material}
              url={url}
              materialId={material._id}
            />
          </Grid>
        </Grid>
      ))}
    </>
  )
}
