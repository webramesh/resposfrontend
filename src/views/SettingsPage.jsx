import React from 'react'
import Page from "../components/Page";
import SettingsNavbar from '../components/SettingsNavbar';
import { Outlet } from 'react-router-dom';
export default function SettingsPage() {
  return (
    <Page className='flex'>
      <SettingsNavbar/>
      <div className='flex-1'>
        <Outlet />
      </div>
    </Page>
  )
}
