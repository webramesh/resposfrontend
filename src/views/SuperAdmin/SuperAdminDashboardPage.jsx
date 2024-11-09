import React from 'react'
import Page from "../../components/Page";
import ImgGirlSmiling from "../../assets/girl-smiling.webp"
import ImgUiflowLogo from "../../assets/uiflow-logo.svg"
import { Link } from 'react-router-dom';
import { IconArrowRight, IconInfoCircleFilled } from '@tabler/icons-react';
import { appVersion, iconStroke, subscriptionAmount } from '../../config/config';
import { useSuperAdminDashboard } from "../../controllers/superadmin.controller";
export default function SuperAdminDashboardPage() {

  const { data, error, isLoading } = useSuperAdminDashboard();

  if(isLoading) {
    return <Page>
      Please wait...
    </Page>
  }

  if(error) {
    console.error(error);

    return <Page>
      Error loading dashboard, Please try later...
    </Page>
  }

  const {
    activeTenants, ordersProcessedToday, salesVolumeToday, mrr, arr
  } = data;

  const mrrValue = mrr * subscriptionAmount
  const arrValue = arr * subscriptionAmount*12

  return (
    <Page className='px-4 py-3 overflow-x-hidden h-full'>
      <h3 className="text-2xl mt-2">Dashboard</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

        <div className='md:row-span-3 bg-restro-superadmin-widget-bg rounded-[42px]'>
          <p className='text-restro-superadmin-text-green font-bold text-center mt-4'>Active Tenants</p>
          <p className='text-white font-black text-7xl text-center'>{Number(activeTenants).toLocaleString("en", {
            notation: "compact"
          })}</p>
          <img src={ImgGirlSmiling} alt="img" className='block h-96 mx-auto -mt-10' />
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <p className='font-bold'>MRR</p>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>${Number(mrrValue).toLocaleString('en',{notation: "compact"})}</p>
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <p className='font-bold'>ARR</p>
          <p className='font-black text-5xl text-restro-green mt-2'>${Number(arrValue).toLocaleString('en',{notation: "compact"})}</p>
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <div className="flex items-center gap-1">
            <p className='font-bold'>Store Sales Volume Today</p>
            <div className='tooltip cursor-pointer tooltip-top' data-tip="*The amount shown is converted to USD; the final amount may vary."><IconInfoCircleFilled size={18} stroke={iconStroke}/></div>
          </div>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>
            ${Number(salesVolumeToday).toLocaleString("en", {notation: "compact"})}
          </p>
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <p className='font-bold'>Orders Processed Today</p>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>{Number(ordersProcessedToday).toLocaleString("en",{notation: "compact"})}</p>
        </div>

        <Link to="/superadmin/dashboard/reports" className='flex items-center justify-center gap-2 text-restro-superadmin-text-black rounded-[42px] border border-restro-border-green-light px-8 py-5 md:col-span-2 hover:bg-restro-green-light transition active:scale-95 hover:text-restro-green font-bold'>
          <p>View more in reports</p>
          <IconArrowRight stroke={iconStroke} />
        </Link>

      </div>

      <a href='https://uiflow.in' target='_blank' className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 text-[#A5A5A5]">
        <img src={ImgUiflowLogo} alt="logo" className='block shadow w-16 h-16 rounded-2xl' />
        <div>
          <p>
            Developed by UIFLOW<sup>TM</sup><br/>
            Version {appVersion}
          </p>
        </div>
      </a>

    </Page>
  )
}
