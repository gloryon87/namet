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
        sx={{mb: 6 }}
        >
        <Navbar/>{children}
        </Container>
        </body>
    </html>
  )
}
