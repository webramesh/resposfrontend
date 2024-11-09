import React, { useContext } from 'react'
import { Outlet } from "react-router-dom"
import Navbar from '../components/Navbar'
import AppBar from '../components/AppBar'
import { NavbarContext } from '../contexts/NavbarContext'

export default function DashboardLayout() {

  const [isNavbarCollapsed] = useContext(NavbarContext)

  return (
    <div className='flex'>
      <Navbar />
      <div className={isNavbarCollapsed?`w-full ml-[5.5rem]`:`w-full ml-[5.5rem] md:ml-72`}>
        <AppBar />
        <Outlet />
      </div>
    </div>
  )
}
