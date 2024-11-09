import React from 'react'
import Page from "../../components/Page";
import { removeDevice, useDevices } from '../../controllers/settings.controller';
import { IconDevices, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { mutate } from 'swr';
import toast from 'react-hot-toast';

export default function DevicesPage() {

  const {APIURL, data:devices, error, isLoading} = useDevices();

  if(isLoading) {
    return <Page>
      Please wait...
    </Page>
  }

  if(error) {
    console.error(error);
    return <Page>
      Error loading devices, Please try later!
    </Page>
  }

  const btnRemoveDevice = async (deviceId) => {
    const isConfirm = window.confirm("Are you sure! This device will be logged out!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await removeDevice(deviceId);

      if(res.status == 200) {
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  }

  return (
    <Page>
      <h3>Devices</h3>


      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full mt-6">
        {devices.map((device, index)=>{

          const { 
            device_id,
            device_ip,
            device_name,
            device_location,
            created_at,
            isMyDevice,
           } = device;

          return <div key={index} className='border flex-1 rounded-2xl p-4 flex items-center gap-2 relative'>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-slate-500 rounded-full">
              <IconDevices stroke={iconStroke} />
            </div>

            <div className='flex-1'>
              <p className='text-sm'>{device_name} <span className="text-xs text-gray-500">- {device_ip}</span></p>
              <p className='text-xs text-gray-500'>Created At: {created_at}</p>
              {isMyDevice && <div className='mt-2 rounded-full text-green-700 bg-green-100 font-bold px-2 py-1 text-xs w-fit'>This Device</div>}
            </div>

            {isMyDevice?<></>:<button onClick={()=>{btnRemoveDevice(device_id)}} className='rounded-full w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 transition hover:bg-red-200 active:scale-95'><IconTrash size={18} stroke={iconStroke} /></button>}
          </div>
        })}
      </div>

    </Page>
  )
}
