import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from "./components/Navbar/Navbar"
import Container from '@mui/material/Container'

const roboto = Roboto({ subsets: ['latin'], weight: ['500'] })

export const metadata = {
  title: 'Namet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Container sx={{mb: 4}}>
        <Navbar/>{children}
        </Container>
        </body>
    </html>
  )
}
