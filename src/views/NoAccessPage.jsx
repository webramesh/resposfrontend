import React from 'react'
import Page from "../components/Page"
import Logo from "../assets/logo.svg";
import { IconChevronLeft } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import { useNavigate } from 'react-router-dom';
export default function NoAccessPage() {
  const navigate = useNavigate();

  return (
    <Page className='px-4 py-3 flex flex-col items-center justify-center w-full min-h-screen'>
      <img src={Logo} alt="logo" className="h-14 block mb-6" />
      <h3 className="text-2xl text-center">Oops! You don't have access to this area! Relogin to check again.</h3>

      <button onClick={()=>navigate(-1)} className='btn btn-sm mt-6 '><IconChevronLeft stroke={iconStroke} /> Go back</button>
    </Page>
  )
}
