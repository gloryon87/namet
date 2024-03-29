import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar/Navbar'
import Container from '@mui/material/Container'
import { SpeedInsights } from '@vercel/speed-insights/next'


const roboto = Roboto({ subsets: ['latin'], weight: ['500'] })

export const metadata = {
  title: 'Намет'
}

export default async function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        <Container
          maxWidth='xl'
          sx={{
            mx: 'auto',
            px: { xs: 1, md: 4 },
            mb: 6,
            width: 'auto',
            overflowY: 'hidden'
          }}
        >
          <Navbar />
          {children}
          <SpeedInsights />
        </Container>
      </body>
    </html>
  )
}
