import React from 'react'
import Page from '../../components/Page'
import { Link, useParams } from 'react-router-dom'
import { useSuperAdminTenantSubscriptionHistory } from '../../controllers/superadmin.controller'
import { IconCheck, IconCreditCard, IconX } from '@tabler/icons-react';
import { iconStroke, subscriptionPrice } from '../../config/config';
export default function SuperAdminTenantSubscriptionHistoryPage() {
  const params = useParams();
  const tenantId = params.id;
  const { APIURL, data, error, isLoading } = useSuperAdminTenantSubscriptionHistory(tenantId);

  if(isLoading) {
    return <Page>Please wait...</Page>
  }

  if(error) {
    console.error(error);
    return <Page>We're getting issue while fetching data! Please try later!</Page>
  }

  const {
    tenantInfo,
    storeDetails,
    totalUsers,
    subscriptionHistory,
  } = data;

  return (
    <Page>

      {/* breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link to="/superadmin/dashboard/tenants">Tenants</Link></li>
          <li>{tenantInfo.name}</li>
          <li>Subscription History</li>
        </ul>
      </div>
      {/* breadcrumbs */}

      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="w-full lg:w-4/12 border rounded-3xl px-5 py-6">
          <p className='text-xl font-bold'>Tenant Details</p>

          <p className='mt-4 text-sm text-gray-500'>Tenant Name</p>
          <p>{tenantInfo.name}</p>

          <p className='mt-4 text-sm text-gray-500'>Status</p>
          {tenantInfo.is_active == 1 && <div className='w-fit flex items-center justify-center text-sm rounded-full  text-restro-green-dark'><IconCheck className='text-restro-green' stroke={iconStroke} /> Active</div>}
          {tenantInfo.is_active == 0 && <div className='w-fit flex items-center justify-center text-sm rounded-full  text-restro-green-dark'><IconX className='text-red-500' stroke={iconStroke} /> InActive</div>}

          <p className='mt-4 text-sm text-gray-500'>Users</p>
          <p>{totalUsers} Users</p>

          <p className='mt-4 text-sm text-gray-500'>Address</p>
          <p>{storeDetails?.address}</p>

          <div className="flex">
            <div className="flex-1">
              <p className='mt-4 text-sm text-gray-500'>Email</p>
              <p>{storeDetails?.email}</p>
            </div>

            <div className="flex-1">
              <p className='mt-4 text-sm text-gray-500'>Phone</p>
              <p>{storeDetails?.phone}</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1">
              <p className='mt-4 text-sm text-gray-500'>Currency</p>
              <p>{storeDetails?.currency}</p>
            </div>

            <div className="flex-1">
              <p className='mt-4 text-sm text-gray-500'>QR Menu</p>
              <p>{storeDetails?.is_qr_menu_enabled?"Enabled": "Disabled"}</p>
            </div>
          </div>



        </div>


        <div className="w-full lg:w-8/12 border rounded-3xl px-5 py-6">
          <p className='text-xl font-bold'>Payment History</p>

          <div className="flex flex-col gap-4 mt-4">
            {subscriptionHistory.map((item, i)=>{

              const {
                id, tenant_id, created_at, starts_on, expires_on, status
              } = item;

              return (
                <div key={i} className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 rounded-xl bg-restro-green-light text-restro-green flex items-center justify-center">
                    <IconCreditCard stroke={iconStroke} />
                  </div>
                  <div className="flex-grow">
                  <div className="flex justify-between w-full gap-1">
                      <p className="text-lg">
                        <span className="font-bold">{subscriptionPrice}</span>/month
                      </p>
                      <div
                        className={`text-xs font-semibold py-1 px-3 rounded-full w-20 sm:w-18 text-center ${
                          status === "cancelled"
                            ? "bg-red-100 text-red-500 border border-red-500"
                            : status === "created"
                            ? "bg-green-100 text-green-500 border border-green-500"
                            : "bg-blue-100 text-blue-500 border border-blue-500"
                        }`}
                      >
                        {status === "cancelled" ? "Cancelled" : status === "created" ? "Created" : "Renewed"}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                      <p className="text-xs text-gray-500">
                        {status === "cancelled" ? "Cancelled on : " : "Paid on: "}
                        <br />
                        {new Date(created_at).toLocaleString("en", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Billing Period: <br />
                        {new Date(starts_on).toLocaleDateString()}-
                        {new Date(expires_on).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );

            })}
          </div>
        </div>
      </div>

    </Page>
  )
}
