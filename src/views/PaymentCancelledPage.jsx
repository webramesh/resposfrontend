import React from 'react'
import AppBarDropdown from '../components/AppBarDropdown'
import Page from "../components/Page";
import Logo from "../assets/logo.svg";
import { IconChevronLeft, IconCircleCheckFilled, IconCircleXFilled, IconLogout } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelledPage() {
  const navigate = useNavigate();
  

  return (
    <Page className=''>
      <div className="fixed flex items-center justify-between px-4 py-3 border-b border-restro-border-green-light w-full bg-white">
        <img src={Logo} alt="logo" className="h-12 block" />

        {/* profile */}
        <AppBarDropdown />
        {/* profile */}
      </div>

      <div className="min-h-screen container mx-auto flex items-center justify-center flex-col">
        <IconCircleXFilled className='text-red-500' size={48} />
        <h1 className="text-2xl font-bold mt-2">Cancelled!</h1>
        <p className="text-center">
          Payment Cancelled/Failed, you can try again!
        </p>

        <button onClick={()=>{navigate("/dashboard/profile")}}  className='flex items-center justify-center gap-2 rounded-full px-4 py-3 mt-4 bg-gray-100 text-gray-500 transition hover:bg-gray-200 active:scale-95 text-sm'>
          <IconChevronLeft stroke={iconStroke} /> Go Back to Profile
        </button>
      </div>
    </Page>
  )
}
