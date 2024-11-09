import React from 'react'
import AppBarDropdown from '../components/AppBarDropdown'
import Page from "../components/Page";
import Logo from "../assets/logo.svg";
import { IconCircleCheckFilled, IconLogout } from '@tabler/icons-react';
import { iconStroke } from '../config/config';
import toast from 'react-hot-toast';
import { signOut } from '../controllers/auth.controller';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const btnLogout = async () => {
    try {
      toast.loading("Please wait...");
      const response = await signOut();
      if (response.status == 200) {
        toast.dismiss();
        toast.success(response.data.message);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong! Try later!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <Page className=''>
      <div className="fixed flex items-center justify-between px-4 py-3 border-b border-restro-border-green-light w-full bg-white">
        <img src={Logo} alt="logo" className="h-12 block" />

        {/* profile */}
        <AppBarDropdown />
        {/* profile */}
      </div>

      <div className="min-h-screen container mx-auto flex items-center justify-center flex-col">
        <IconCircleCheckFilled className='text-restro-green' size={48} />
        <h1 className="text-2xl font-bold mt-2">Success!</h1>
        <p className="text-center">
          Subscription created successfully, Please logout and Sign in again to access the App!
        </p>

        <button onClick={btnLogout} className='flex items-center justify-center gap-2 rounded-full px-4 py-3 mt-4 bg-red-50 text-red-500 transition hover:bg-red-200 active:scale-95 text-sm'>
          <IconLogout stroke={iconStroke} /> Logout
        </button>
      </div>
    </Page>
  )
}
