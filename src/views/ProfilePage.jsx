import React from 'react';
import Page from "../components/Page";
import { IconCreditCard, IconUser } from "@tabler/icons-react";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails"
import { iconStroke } from "../config/config";
import SubscriptionDetails from '../components/SubscriptionDetails';
export default function ProfilePage() {

  const user = getUserDetailsInLocalStorage();
  const {name, designation, photo, role} = user;

  return (
    <Page>
      <h3 className='text-center mt-4'>My Profile</h3>

      <div className="flex flex-col gap-4 w-full items-center justify-center mt-8">
        <div className="w-full md:w-96 rounded-3xl border border-restro-green-light">
          <div className="w-full h-20 rounded-3xl p-2 bg-restro-green relative">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gray-100 text-gray-500 absolute -bottom-1/2 left-0 right-0">
              <IconUser size={32} stroke={iconStroke} />
            </div>
          </div>

          <div className="px-4 py-3 mt-8">
            <p className=" text-sm text-gray-400">Name:</p>
            <p>{name}</p>

            <p className="mt-4 text-sm text-gray-400">Designation:</p>
            <p>{designation}</p>
          </div>
        </div>

        {
          role == "admin" && <SubscriptionDetails />
        }
      </div>
    </Page>
  )
}
