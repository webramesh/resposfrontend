import React, { useRef, useState, Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import Page from "../components/Page";
import {
  IconEye,
  IconFilter,
  IconPlus,
  IconPrinter,
  IconReceipt,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { getInvoiceOrders, getInvoicesInit, searchInvoices, useInvoices } from "../controllers/invoices.controller";
import { getOrdersInit } from "../controllers/orders.controller";
import { CURRENCIES } from "../config/currencies.config";
import { setDetailsForReceiptPrint } from '../helpers/ReceiptHelper';

export default function InvoicesPage() {

  const filters = [
    { key: "today", value: "Today" },
    { key: "tomorrow", value: "Tomorrow" },
    { key: "yesterday", value: "Yesterday" },
    { key: "last_7days", value: "Last 7 Days" },
    { key: "this_month", value: "This Month" },
    { key: "last_month", value: "Last Month" },
    { key: "custom", value: "Custom" },
  ];

  const searchRef = useRef();
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

  const customerSearchRef = useRef();

  const [state, setState] = useState({
    search: "",
    searchResults: [],
    spage: 1,
    filter: filters[0].key,
    fromDate: null,
    toDate: null,
    customer: null,

    printSettings: null,
    storeSettings: null,
    currency: null
  });

  useEffect(()=>{
    async function init(){
      try {
        const res = await getInvoicesInit();
        if(res.status == 200) {
          const ordersInit = res.data;
          const currency = CURRENCIES.find((c)=>c.cc==ordersInit?.storeSettings?.currency);

          setState({
            ...state,
            printSettings: ordersInit.printSettings || {},
            storeSettings: ordersInit.storeSettings || {},
            currency: currency?.symbol,
          });
        }
      } catch (error) {
        console.error(error);
        toast.dismiss();
        toast.error("Error loading orders! Please try later!");
      }
    }
    init();
  },[]);

  const {data: invoices, error, isLoading} = useInvoices({
    type: state.filter,
    from: state.fromDate,
    to: state.toDate,
  });

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    return <Page>Error loading details! Please try later!</Page>;
  }

  const btnSearch = async () => {
    const searchQuery = searchRef.current.value;
    if (!new String(searchQuery).trim()) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await searchInvoices(new String(searchQuery).trim());
      if(res.status == 200) {
        toast.dismiss();
        setState({
          ...state,
          search: searchQuery,
          searchResults: res.data,
          spage: 1,
        });
      } else {
        toast.dismiss();
        toast.error("No result found!");
      }

    } catch (error) {
      console.error(error);
      const message = error.response.data.message || "Something went wrong! Try later!";

      toast.dismiss();
      toast.error(message);
    }
  }
  const btnClearSearch = () => {
    searchRef.current.value = null;

    setState({
      ...state,
      search: "",
      searchResults: [],
      spage: 1,
    });
  };

  const btnViewReceipt = async (orderIdsArr, tokens) => {
    try {
      toast.loading("Please wait...");
      const res = await getInvoiceOrders(orderIdsArr);
      toast.dismiss();

      if(res.status == 200) {
        console.log(res.data);
        console.log(orderIdsArr);
        const {
          subtotal,
          taxTotal,
          total,
          orders: ordersArr
        } = res.data;

        const orders = [];
        const orderIds = orderIdsArr.join(", ");

        for (const o of ordersArr) {
          const items = o.items;
          items.forEach((i)=>{
            const variant = i.variant_id ? {
                id: i.variant_id,
                title: i.variant_title,
                price: i.variant_price
            } : null;
            orders.push({
              ...i,
              title: i.item_title,
              addons_ids: i?.addons?.length > 0 ? i?.addons?.map((a)=>a.id):[],
              variant: variant
            });
          })
        }

        const {customer_id, customer_type, customer_name, date, delivery_type} = ordersArr;

        setDetailsForReceiptPrint({
          cartItems: orders, deliveryType:delivery_type, customerType:customer_type, customer:{id: customer_id, name: customer_name}, tableId: null, currency:state.currency, storeSettings: state.storeSettings, printSettings:state.printSettings,
          itemsTotal: subtotal,
          taxTotal: taxTotal,
          payableTotal: total,
          tokenNo: tokens,
          orderId: orderIds
        });

        const receiptWindow = window.open("/print-receipt", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Error processing your request, Please try later!";
      toast.dismiss();
      console.error(error);
      toast.error(message);
    }
  };

  const btnPrintReceipt = async (orderIdsArr, tokens) => {
    try {
      toast.loading("Please wait...");
      const res = await getInvoiceOrders(orderIdsArr);
      toast.dismiss();

      if(res.status == 200) {
        console.log(res.data);
        console.log(orderIdsArr);
        const {
          subtotal,
          taxTotal,
          total,
          orders: ordersArr
        } = res.data;

        const orders = [];
        const orderIds = orderIdsArr.join(", ");

        for (const o of ordersArr) {
          const items = o.items;
          items.forEach((i)=>{
            const variant = i.variant_id ? {
                id: i.variant_id,
                title: i.variant_title,
                price: i.variant_price
            } : null;
            orders.push({
              ...i,
              title: i.item_title,
              addons_ids: i?.addons?.length > 0 ? i?.addons?.map((a)=>a.id):[],
              variant: variant
            });
          })
        }

        const {customer_id, customer_type, customer_name, date, delivery_type} = ordersArr;

        setDetailsForReceiptPrint({
          cartItems: orders, deliveryType:delivery_type, customerType:customer_type, customer:{id: customer_id, name: customer_name}, tableId: null, currency:state.currency, storeSettings: state.storeSettings, printSettings:state.printSettings,
          itemsTotal: subtotal,
          taxTotal: taxTotal,
          payableTotal: total,
          tokenNo: tokens,
          orderId: orderIds
        });

        const receiptWindow = window.open("/print-receipt", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        receiptWindow.onload = (e) => {
          setTimeout(()=>{
            receiptWindow.print();
          },400)
        }

      }
    } catch (error) {
      const message = error?.response?.data?.message || "Error processing your request, Please try later!";
      toast.dismiss();
      console.error(error);
      toast.error(message);
    }
  };

  return (
    <Page>
      <div className="flex flex-wrap gap-4 flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="text-2xl">Invoices</h3>

        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded-lg flex items-center">
            <input
              ref={searchRef}
              defaultValue={state.search}
              type="text"
              placeholder="Search Invoices"
              className="bg-transparent placeholder:text-gray-400 outline-none block"
            />
            {state.search && (
              <button onClick={btnClearSearch} className="text-gray-400">
                <IconX stroke={iconStroke} size={18} />
              </button>
            )}
          </div>
          <button
            onClick={btnSearch}
            className="text-white bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-1 outline-restro-border-green-light"
          >
            Search
          </button>
          <button
            onClick={() => document.getElementById("filter-dialog").showModal()}
            className="w-8 h-8 flex items-center justify-center text-gray-500 rounded-full hover:bg-gray-100 active:scale-95 transition"
          >
            <IconFilter />
          </button>
        </div>
      </div>

      {/* search result */}
      {state.searchResults.length > 0 && <div className="mt-6">
        <h3>Showing Search Result for "{state.search}"</h3>
        <div className="overflow-x-auto w-full">
          <table className="table table-sm table-zebra border w-full">
            <thead>
              <tr>
                <th>Invoice ID:</th>
                {/* <th>Order IDs</th> */}
                <th>Tokens</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Delivery Type</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.searchResults.map((invoice, index)=>{
                const {
                  invoice_id,
                  created_at,
                  sub_total,
                  tax_total,
                  total,
                  table_id,
                  table_title,
                  floor,
                  delivery_type,
                  customer_type,
                  customer_id,
                  name,
                  email,
                  orders,
                } = invoice;

                const orderIdsArr = orders.map(o=>o.order_id);
                const tokenIdsArr = orders.map(o=>o.token_no);
                const orderIds = orderIdsArr.join(", ")
                const tokens = tokenIdsArr.join(", ");

                return <tr key={index}>
                  <td>{invoice_id}</td>
                  {/* <td>{orderIds}</td> */}
                  <td>{tokens}</td>
                  <td>{new Intl.DateTimeFormat('en', {dateStyle: "medium", timeStyle: "short"}).format(new Date(created_at))}</td>
                  <td>{state.currency}{sub_total}</td>
                  <td>{state.currency}{tax_total}</td>
                  <td className="font-bold">{state.currency}{total}</td>
                  <td>{delivery_type?delivery_type:"N/A"}</td>
                  <td>{customer_id ?<b>{name}-({customer_id})</b>:"WALKIN"}</td>
                  <td>{table_id ? <b>{table_title}-{floor}</b>:"N/A"}</td>

                  <td className="flex items-center gap-2">
                    <button onClick={()=>{btnViewReceipt(orderIdsArr, tokens)}} className="btn btn-sm btn-circle text-slate-500">
                      <IconReceipt stroke={iconStroke} />
                    </button>
                    <button onClick={()=>{btnPrintReceipt(orderIdsArr, tokens)}} className="btn btn-sm btn-circle text-slate-500">
                      <IconPrinter stroke={iconStroke} />
                    </button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>}
      {/* search result */}

      {/* data */}
      <h3 className="mt-6 mb-4 text-base">Showing Invoices for {filters.find(f=>f.key==state.filter).value}</h3>
      {invoices.length == 0 ? (
        <div className="text-center w-full h-[50vh] flex flex-col items-center justify-center text-gray-500">
          <img
            src="/assets/illustrations/no-invoice.svg"
            alt="no invoices"
            className="w-full md:w-60"
          />
          <p>No Results found! Change the Filter!</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table table-sm table-zebra border w-full">
            <thead>
              <tr>
                <th>Invoice ID:</th>
                {/* <th>Order IDs</th> */}
                <th>Tokens</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Delivery Type</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index)=>{
                const {
                  invoice_id,
                  created_at,
                  sub_total,
                  tax_total,
                  total,
                  table_id,
                  table_title,
                  floor,
                  delivery_type,
                  customer_type,
                  customer_id,
                  name,
                  email,
                  orders,
                } = invoice;

                const orderIdsArr = orders.map(o=>o.order_id);
                const tokenIdsArr = orders.map(o=>o.token_no);
                const orderIds = orderIdsArr.join(", ")
                const tokens = tokenIdsArr.join(", ");

                return <tr key={index}>
                  <td>{invoice_id}</td>
                  {/* <td>{orderIds}</td> */}
                  <td>{tokens}</td>
                  <td>{new Intl.DateTimeFormat('en', {dateStyle: "medium", timeStyle: "short"}).format(new Date(created_at))}</td>
                  <td>{state.currency}{sub_total}</td>
                  <td>{state.currency}{tax_total}</td>
                  <td className="font-bold">{state.currency}{total}</td>
                  <td>{delivery_type?delivery_type:"N/A"}</td>
                  <td>{customer_id ?<b>{name}-({customer_id})</b>:"WALKIN"}</td>
                  <td>{table_id ? <b>{table_title}-{floor}</b>:"N/A"}</td>

                  <td className="flex items-center gap-2">
                    <button onClick={()=>{btnViewReceipt(orderIdsArr, tokens)}} className="btn btn-sm btn-circle text-slate-500">
                      <IconReceipt stroke={iconStroke} />
                    </button>
                    <button onClick={()=>{btnPrintReceipt(orderIdsArr, tokens)}} className="btn btn-sm btn-circle text-slate-500">
                      <IconPrinter stroke={iconStroke} />
                    </button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* data */}

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
              <button onClick={()=>{
                setState({
                  ...state,
                  filter: filterTypeRef.current.value,
                  fromDate: fromDateRef.current.value || null,
                  toDate: toDateRef.current.value || null,
                });
              }} className="btn ml-2">Apply</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* filter dialog */}
    </Page>
  )
}
