import React, { useRef, useState } from 'react'
import Page from "../../components/Page";
import { useSuperAdminReports } from '../../controllers/superadmin.controller';
import { IconBuildingStore, IconCarrot, IconFilter, IconInfoCircleFilled, IconListDetails } from '@tabler/icons-react';
import { iconStroke, subscriptionAmount } from '../../config/config';
import ImgGirlSmiling from "../../assets/girl-smiling.webp"

export default function SuperAdminReportsPage() {
  const filters = [
    { key: "today", value: "Today" },
    { key: "yesterday", value: "Yesterday" },
    { key: "last_7days", value: "Last 7 Days" },
    { key: "this_month", value: "This Month" },
    { key: "last_month", value: "Last Month" },
    { key: "custom", value: "Custom Date Range" },
  ];

  const fromDateRef = useRef();
  const toDateRef = useRef();
  const filterTypeRef = useRef();

  const now = new Date();
  const defaultDateFrom = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const defaultDateTo = `${now.getFullYear()}-${(now.getMonth() + 2)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  const [state, setState] = useState({
    filter: filters[0].key,
    fromDate: null,
    toDate: null,
  });

  const {APIURL, data, error, isLoading} = useSuperAdminReports({
    type: state.filter,
    from: state.fromDate,
    to: state.toDate,
  });

  if(isLoading) {
    return <Page>
      Please wait...
    </Page>
  }

  if(error) {
    console.error(error);
    return <Page>
      Error Loading Reports Data, Please try later!
    </Page>;
  }

  const {
    activeTenants, mrr, arr,
    totalCustomers, topSellingItems,
    salesVolume, ordersProcessed
  } = data;

  const mrrValue = mrr * subscriptionAmount
  const arrValue = arr * subscriptionAmount*12

  return (
    <Page className='px-4 py-3 overflow-x-hidden h-full'>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl">Reports</h3>

        <button
          onClick={() => document.getElementById("filter-dialog").showModal()}
          className="btn btn-sm rounded-full"
        >
          <IconFilter stroke={iconStroke} /> Filters
        </button>
      </div>

      <h3 className="mt-6 mb-4 text-base">Showing Data for {filters.find(f=>f.key==state.filter).value}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

        <div className='md:row-span-3 h-[28rem] bg-restro-superadmin-widget-bg rounded-[42px] overflow-hidden'>
          <p className='text-restro-superadmin-text-green font-bold text-center mt-4'>Active Tenants</p>
          <p className='text-white font-black text-7xl text-center'>{Number(activeTenants).toLocaleString("en", {
            notation: "compact"
          })}</p>
          <img src={ImgGirlSmiling} alt="img" className='block h-96 mx-auto -mt-10' />
        </div>

        <div className='md:row-span-3 h-[28rem] bg-gray-100 rounded-[42px] overflow-y-auto '>
          <div className='py-6 px-8 bg-gray-100/80 backdrop-blur rounded-t-[42px] sticky top-0'>
            <h3 className='font-bold'>Top Selling Items</h3>
          </div>
          {topSellingItems?.length == 0 && 
            <div className='w-full mt-20 flex items-center justify-center flex-col px-8 2xl:px-10'>
              <IconListDetails stroke={iconStroke} />
              <p className='text-center text-gray-500'>No Top Selling items found for Selected Filter!</p>
            </div>
          }

          <div className='px-8 flex flex-col'>
            {
              topSellingItems.map((item, i)=>{
                const {tenant_name, tenant_id, item_id, title, qty} = item
                return <div key={i} className='bg-white rounded-3xl flex items-center gap-2 p-4 mb-4'>
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500'>
                    <IconCarrot stroke={iconStroke} />
                  </div>
                  <div className="flex-1">
                    <p>{title}</p>
                    <p className="text-xs">{tenant_name}</p>
                  </div>
                  <p className='font-bold mr-2'>
                    {Number(qty).toLocaleString("en",{notation: "compact"})}
                  </p>
                </div>
              })
            }
          </div>
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
            <p className='font-bold'>Store Sales Volume</p>
            <div className='tooltip cursor-pointer tooltip-top' data-tip="*The amount shown is converted to USD; the final amount may vary."><IconInfoCircleFilled size={18} stroke={iconStroke}/></div>
          </div>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>
            ${Number(salesVolume).toLocaleString("en", {notation: "compact"})}
          </p>
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <p className='font-bold'>Orders Processed</p>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>{Number(ordersProcessed).toLocaleString("en",{notation: "compact"})}</p>
        </div>

        <div className='rounded-[42px] border border-restro-border-green-light px-8 py-5 flex flex-col justify-center'>
          <p className='font-bold'>All Tenant's Customers</p>
          <p className='font-black text-5xl text-restro-superadmin-text-black mt-2'>{Number(totalCustomers).toLocaleString("en",{notation: "compact"})}</p>
        </div>
      </div>

      {/* filter dialog */}
      <dialog id="filter-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center">
            <IconFilter stroke={iconStroke} /> Filter
          </h3>
          {/* filters */}
          <div className="my-4">
            <div>
              <label className=" block text-gray-500 text-sm">Filter</label>
              <select
                className="select select-sm select-bordered w-full"
                ref={filterTypeRef}
              >
                {filters.map((filter, index) => (
                  <option key={index} value={filter.key}>
                    {filter.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <label
                  htmlFor="fromDate"
                  className=" block text-gray-500 text-sm"
                >
                  From
                </label>
                <input
                  defaultValue={defaultDateFrom}
                  type="date"
                  ref={fromDateRef}
                  className="text-sm w-full border rounded-lg px-4 py-1 bg-gray-50 outline-restro-border-green-light"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="toDate"
                  className=" block text-gray-500 text-sm"
                >
                  To
                </label>
                <input
                  defaultValue={defaultDateTo}
                  type="date"
                  ref={toDateRef}
                  className="text-sm w-full border rounded-lg px-4 py-1 bg-gray-50 outline-restro-border-green-light"
                />
              </div>
            </div>
          </div>
          {/* filters */}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button
                onClick={() => {
                  setState({
                    ...state,
                    filter: filterTypeRef.current.value,
                    fromDate: fromDateRef.current.value || null,
                    toDate: toDateRef.current.value || null,
                  });
                }}
                className="btn ml-2"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* filter dialog */}
    </Page>
  )
}
