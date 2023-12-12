'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import style from './navbar.module.scss'


const menuItemStyle = { width: '25%', justifyContent: 'center', overflow: 'hidden', color: 'white' }

function Navbar () {
  const pathname = usePathname()
  return (
    <MenuList
      sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 1, backgroundColor: '#2196f3' }}
    >
      <MenuItem sx={menuItemStyle}>
        <Link
          href='/production'
          className={`${style.link} ${pathname === '/production' ? style.active : ''}`}
        >
            Виробники
        </Link>
      </MenuItem>
      <MenuItem sx={menuItemStyle}>
        <Link
          href='/orders'
          className={`${style.link} ${
            pathname === '/orders' ? style.active : ''
          }`}
        >
          Замовлення
        </Link>
      </MenuItem>
      <MenuItem sx={menuItemStyle}>
        <Link
          href='/materials'
          className={`${style.link} ${
            pathname === '/materials' ? style.active : ''
          }`}
        >
          Матеріали
        </Link>
      </MenuItem>
      <MenuItem sx={menuItemStyle}>
        <Link
          href='/goods'
          className={`${style.link} ${
            pathname === '/goods' ? style.active : ''
          }`}
        >
          Склад
        </Link>
      </MenuItem>
    </MenuList>
  )
}

export default Navbar
