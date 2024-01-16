import Typography from '@mui/material/Typography'
import AddMaterial from '../components/materials/AddMaterial/AddMaterial'
import Grid from '@mui/material/Grid'
import TransferMaterial from '../components/materials/TransferMaterial/TransferMaterial'
import EditMaterial from '../components/materials/EditMaterial/EditMaterial'
import { Box } from '@mui/material'

// Metadata

export const metadata = {
  title: 'Матеріали'
}

const url = process.env.REACT_APP_SERVER_URL || ''
const gridStyle = { border: '1px solid lightgray', borderTop: 0 }

async function getData () {
  try {
    const res = await fetch(`${url}/api/materials`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store'
      }
    })

    if (res.ok) {
      const jsonData = await res.json()
      return jsonData
    } else {
      throw new Error('Помилка сервера')
    }
  } catch (error) {
    throw new Error('Не вдалось отримати дані')
  }
}

export default async function Materials () {
  const materials = await getData()
  const filteredMaterials = materials.filter(material => material.qty > 0)
  const materilsQtyArray = materials.map(material => material.qty)
  const materialsQty = materilsQtyArray.reduce((a, b) => a + b, 0)

  return (
    <>
      <Typography variant='h5'>Матеріали</Typography>
      <Box sx={{ display: 'flex', columnGap: 2, justifyContent: 'space-between', flexWrap: 'wrap', mb: 1, mt: 2 }}>
        <Typography
          color='primary'
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
        >
          Загальна площа матеріалів: <strong>{materialsQty} м²</strong>{' '}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <AddMaterial url={url} />
          <TransferMaterial url={url} materials={filteredMaterials} />
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
      {materials.map(material => (
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
