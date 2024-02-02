import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar/Navbar'
import Container from '@mui/material/Container'

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
            px: { xs: 0, md: 3 },
            mb: 6,
            width: 'auto',
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '0.4em'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888'
            }
          }}
        >
          <Navbar />
          {children}
        </Container>
      </body>
    </html>
  )
}
