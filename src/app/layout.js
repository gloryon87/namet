import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from "./components/Navbar/Navbar"
import Container from '@mui/material/Container'

const roboto = Roboto({ subsets: ['latin'], weight: ['500'] })

export const metadata = {
  title: 'Намет',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Container maxWidth='xl' 
          sx={{ mx: { xs: 0, md: 3}, mb: 6, width: 'auto' }}
        >
        <Navbar/>{children}
        </Container>
        </body>
    </html>
  )
}
