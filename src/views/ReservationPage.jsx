import React, { useRef, useState, Fragment } from "react";
import Page from "../components/Page";
import {
  IconFilter,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

import { searchCustomer } from "../controllers/customers.controller";
import CustomerCard from "../components/CustomerCard";
import {
  addReservation,
  deleteReservation,
  searchReservations,
  updateReservation,
  useReservations,
  useReservationsInit,
} from "../controllers/reservations.controller";
import ReservationCard from "../components/ReservationCard";
import { SCOPES } from "../config/scopes";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
import AsyncCreatableSelect from 'react-select/async-creatable';
import DialogAddCustomer from '../components/DialogAddCustomer';

export default function ReservationPage() {

  const { role, scope } = getUserDetailsInLocalStorage();
  const userScopes = scope?.split(",");
  let isManageAllowed = false;
  if(role == "admin") {
    isManageAllowed = true;
  } else {
    if(userScopes.includes(SCOPES.MANAGE_RESERVATIONS) || userScopes.includes(SCOPES.RESERVATIONS)) {
      isManageAllowed = true;
    }
  }

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
  const reservationDateRef = useRef();
  const reservationTableRef = useRef();
  const reservationPeopleCountRef = useRef();
  const reservationStatusRef = useRef();
  const reservationNotesRef = useRef();

  const updateReservationIdRef = useRef();
  const updateReservationDateRef = useRef();
  const updateReservationTableRef = useRef();
  const updateReservationPeopleCountRef = useRef();
  const updateReservationStatusRef = useRef();
  const updateReservationNotesRef = useRef();

  const [state, setState] = useState({
    search: "",
    searchResults: [],
    spage: 1,
    filter: filters[0].key,
    fromDate: null,
    toDate: null,
    customer: null,
    addCustomerDefaultValue: null,
    addReservationSelectedBranch: null,
  });

  const {
    data: storeTablesData,
    error: errorStoreTables,
    isLoading: isLoadingStoreTables,
  } = useReservationsInit();


  const {
    APIURL,
    data: reservations,
    error,
    isLoading,
  } = useReservations({
    type: state.filter,
    from: state.fromDate,
    to: state.toDate,
  });

  if (isLoadingStoreTables) {
    return <Page>Please wait...</Page>;
  }
  if (errorStoreTables) {
    return <Page>Error loading details! Please try later!</Page>;
  }

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    return <Page>Error loading details! Please try later!</Page>;
  }

  const { storeTables } =  storeTablesData;

  const btnSearch = async () => {
    const searchQuery = searchRef.current.value;
    if (!new String(searchQuery).trim()) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await searchReservations(new String(searchQuery).trim());
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
  };
  const btnClearSearch = () => {
    searchRef.current.value = null;

    setState({
      ...state,
      search: "",
      searchResults: [],
      spage: 1,
    });
  };

  const btnSearchCustomer = async () => {
    const customerSearch = customerSearchRef.current.value;

    if (!customerSearch) {
      toast.error("Please provide customer phone number to search!");
      return;
    }

    try {
      toast.loading("Please wait...");

      const res = await searchCustomer(customerSearch);
      if (res.status == 200) {
        toast.dismiss();

        const customer = res.data;
        setState({
          ...state,
          customer: customer,
        });
      } else {
        toast.dismiss();
        toast.error(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      toast.dismiss();
      toast.error(message);
    }
  };

  const clearSelectedCustomer = () => {
    setState({
      ...state,
      customer: null,
    });
  };

  const setCustomer = (customer) => {
    if(customer) {
      setState({
        ...state,
        customer: {phone: customer.value, name:customer.label},
      })
    } else {
      clearSelectedCustomer();
    }
  }

  const searchCustomersAsync = async (inputValue) => {

    try {
      if(inputValue) {
        const resp = await searchCustomer(inputValue);
        if(resp.status == 200) {
          return resp.data.map((data)=>( {label: `${data.name} - (${data.phone})`, value: data.phone} ));
        }
      }
    } catch (error) {
      console.log(error);

    }
  }

  const btnAdd = async () => {
    const customerId = state.customer.phone;
    const date = reservationDateRef.current.value;
    const tableId = reservationTableRef.current.value || null;
    const peopleCount = reservationPeopleCountRef.current.value || null;
    const status = reservationStatusRef.current.value || null;
    const notes = reservationNotesRef.current.value || null;

    if (!customerId) {
      toast.error("Please select customer!");
      return;
    }

    if (!date) {
      toast.error("Please select date & time!");
      return;
    }

    try {
      const res = await addReservation(
        customerId,
        date,
        tableId,
        status,
        notes,
        peopleCount
      );
      if (res.status == 200) {
        reservationDateRef.current.value = null;
        reservationTableRef.current.value = null;
        reservationPeopleCountRef.current.value = null;
        reservationStatusRef.current.value = null;
        reservationNotesRef.current.value = null;

        await mutate(APIURL);
        clearSelectedCustomer();
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  };

  const btnDelete = async id => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteReservation(id);

      if(res.status == 200) {
        await mutate(APIURL);
        setState({
          ...state,
          searchResults: state.searchResults.filter(s=>s.id != id)
        });
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  const btnShowUpdate = (id, date, table, peopleCount, status, notes) => {
    updateReservationIdRef.current.value = id;
    updateReservationDateRef.current.value = date;
    updateReservationTableRef.current.value = table;
    updateReservationPeopleCountRef.current.value = peopleCount;
    updateReservationStatusRef.current.value = status;
    updateReservationNotesRef.current.value = notes;

    document.getElementById("modal-update").showModal();
  };

  const btnUpdate = async () => {
    const id = updateReservationIdRef.current.value;
    const date = updateReservationDateRef.current.value;
    const tableId = updateReservationTableRef.current.value || null;
    const peopleCount = updateReservationPeopleCountRef.current.value || null;
    const status = updateReservationStatusRef.current.value || null;
    const notes = updateReservationNotesRef.current.value || null;

    if (!id) {
      toast.error("Invalid request!");
      return;
    }

    if (!date) {
      toast.error("Please select date & time!");
      return;
    }

    try {
      const res = await updateReservation(
        id, date, tableId, status, notes, peopleCount
      );
      if (res.status == 200) {
        updateReservationIdRef.current.value = null;
        updateReservationDateRef.current.value = null;
        updateReservationTableRef.current.value = null;
        updateReservationPeopleCountRef.current.value = null;
        updateReservationStatusRef.current.value = null;
        updateReservationNotesRef.current.value = null;

        await mutate(APIURL);
        clearSelectedCustomer();
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <Page>
      <div className="flex flex-wrap gap-4 flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex gap-6">
          <h3 className="text-2xl">Reservations</h3>
          {
            isManageAllowed && <button
            onClick={() => {
              document.getElementById("modal-add").showModal();
            }}
            className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
          >
            <IconPlus size={22} stroke={iconStroke} /> New
          </button>
          }
        </div>

        <div className="flex gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded-lg flex items-center">
            <input
              ref={searchRef}
              defaultValue={state.search}
              type="text"
              placeholder="Search Reservation"
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {state.searchResults.map((reservation, index) => {
            const {
              id,
              customer_id,
              customer_name,
              date,
              table_id,
              table_title,
              status,
              notes,
              people_count,
              unique_code,
              created_at,
              updated_at,
            } = reservation;

            const dateLocal = new Date(date).toLocaleDateString("EN", {
              dateStyle: "medium",
            });
            const timeLocal = new Date(date).toLocaleTimeString("EN", {
              timeStyle: "short",
            });

            const d = new Date(date);
            const dateFormatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

            const createdAt = new Date(created_at).toLocaleString("EN", {dateStyle: "medium", timeStyle: "short"});

            return <ReservationCard
              btnDelete={()=>{
                btnDelete(id)
              }}
              btnUpdate={()=>{
                btnShowUpdate(id, dateFormatted, table_id, people_count, status, notes);
              }}
              createdAt={createdAt}
              customer_name={customer_name}
              dateLocal={dateLocal}
              notes={notes}
              people_count={people_count}
              status={status}
              table_title={table_title}
              timeLocal={timeLocal}
              unique_code={unique_code}
              key={unique_code}
            />;
          })}
        </div>
      </div>}
      {/* search result */}

      {/* data */}
      <h3 className="mt-6 mb-4 text-base">Showing Reservations for {filters.find(f=>f.key==state.filter).value}</h3>
      {reservations.length == 0 ? (
        <div className="text-center w-full h-[50vh] flex flex-col items-center justify-center text-gray-500">
          <img
            src="/assets/illustrations/no-reservation.svg"
            alt="no reservation"
            className="w-full md:w-60"
          />
          <p>No Results found! Change the Filter!</p>
        </div>
      ) : (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {reservations.map((reservation, index) => {
            const {
              id,
              customer_id,
              customer_name,
              date,
              table_id,
              table_title,
              status,
              notes,
              people_count,
              unique_code,
              created_at,
              updated_at,
            } = reservation;

            const dateLocal = new Date(date).toLocaleDateString("EN", {
              dateStyle: "medium",
            });
            const timeLocal = new Date(date).toLocaleTimeString("EN", {
              timeStyle: "short",
            });

            const d = new Date(date);
            const dateFormatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

            const createdAt = new Date(created_at).toLocaleString("EN", {dateStyle: "medium", timeStyle: "short"});

            return <ReservationCard
              btnDelete={()=>{
                btnDelete(id)
              }}
              btnUpdate={()=>{
                btnShowUpdate(id, dateFormatted, table_id, people_count, status, notes);
              }}
              createdAt={createdAt}
              customer_name={customer_name}
              dateLocal={dateLocal}
              notes={notes}
              people_count={people_count}
              status={status}
              table_title={table_title}
              timeLocal={timeLocal}
              unique_code={unique_code}
              key={unique_code}
            />;
          })}
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

      {/* add dialog */}
      <DialogAddCustomer
        defaultValue={state.addCustomerDefaultValue}
        branchId={state.addReservationSelectedBranch}
        role={role}
        onSuccess={(phone, name)=>{
          setCustomer({value: phone, label: `${name} - (${phone})`})
        }}
      />
      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Reservation</h3>

          <div className="mt-4">
            <label
              htmlFor="customer"
              className="mb-1 block text-gray-500 text-sm"
            >
              Select Customer{" "}
              <span className="text-xs text-gray-400">- (Required)</span>
            </label>
            {/* <div className="text-sm w-full border rounded-lg bg-gray-50 flex">
              <input
                type="search"
                name="customer"
                className="flex-1 block py-2 px-4 bg-transparent outline-none"
                placeholder="Search Customer by Phone"
                ref={customerSearchRef}
              />
              <button
                onClick={btnSearchCustomer}
                className="text-gray-500 hover:bg-gray-300 active:scale-95 transition rounded-lg bg-gray-200 w-9 h-9 flex items-center justify-center"
              >
                <IconSearch size={18} stroke={iconStroke} />
              </button>
            </div> */}

              <AsyncCreatableSelect
              menuPlacement='auto'
              loadOptions={searchCustomersAsync}
              isClearable
              noOptionsMessage={(v)=>{return "Type something to find..."}}
              onChange={(v)=>{
                setCustomer(v);
              }}
              onCreateOption={(inputValue)=>{
                setState({
                  ...state,
                  addCustomerDefaultValue: inputValue,
                })
                document.getElementById("modal-add-customer").showModal();
              }}
            />

          </div>

          <div className="mt-4">
            {state.customer && (
              <CustomerCard
                phone={state.customer.phone}
                name={state.customer.name}
                // email={state.customer.email}
                birth_date={state.customer.birth_date}
                gender={state.customer.gender}
                // created_at={state.customer.created_at}
                btnAction={() => {
                  clearSelectedCustomer();
                }}
              />
            )}
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="date"
                className="mb-1 block text-gray-500 text-sm"
              >
                Date <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={reservationDateRef}
                type="datetime-local"
                name="date"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Date"
                min={new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"))}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="table"
                className="mb-1 block text-gray-500 text-sm"
              >
                Table
              </label>
              <select
                ref={reservationTableRef}
                name="table"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Table"
              >
                <option value="">Select Table</option>
                {storeTables.map((storeTable, index) => (
                  <option key={storeTable.id} value={storeTable.id}>
                    {storeTable.table_title} (Capacity:{" "}
                    {storeTable.seating_capacity}) - {storeTable.floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <div className="flex-1">
              <label
                htmlFor="people"
                className="mb-1 block text-gray-500 text-sm"
              >
                People Count{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={reservationPeopleCountRef}
                min={0}
                type="number"
                name="people"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter People Count"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="status"
                className="mb-1 block text-gray-500 text-sm"
              >
                Status
              </label>
              <select
                ref={reservationStatusRef}
                name="status"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Status"
              >
                <option value="booked">Booked</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="my-4">
            <label htmlFor="notes" className="mb-1 block text-gray-500 text-sm">
              Notes
            </label>
            <textarea
              ref={reservationNotesRef}
              name="notes"
              placeholder="Enter Notes Here..."
              className="w-full block h-24 text-sm border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
            ></textarea>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  clearSelectedCustomer();
                }}
                className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500"
              >
                Close
              </button>
              <button
                onClick={() => {
                  btnAdd();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* add dialog */}

      {/* update dialog */}
      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Reservation</h3>
          <input type="hidden" ref={updateReservationIdRef} />
          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="date"
                className="mb-1 block text-gray-500 text-sm"
              >
                Date <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={updateReservationDateRef}
                type="datetime-local"
                name="date"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Date"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="table"
                className="mb-1 block text-gray-500 text-sm"
              >
                Table
              </label>
              <select
                ref={updateReservationTableRef}
                name="table"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Table"
              >
                <option value="">Select Table</option>
                {storeTables.map((storeTable, index) => (
                  <option key={storeTable.id} value={storeTable.id}>
                    {storeTable.table_title} (Capacity:{" "}
                    {storeTable.seating_capacity}) - {storeTable.floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <div className="flex-1">
              <label
                htmlFor="people"
                className="mb-1 block text-gray-500 text-sm"
              >
                People Count{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={updateReservationPeopleCountRef}
                min={0}
                type="number"
                name="people"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter People Count"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="status"
                className="mb-1 block text-gray-500 text-sm"
              >
                Status
              </label>
              <select
                ref={updateReservationStatusRef}
                name="status"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Status"
              >
                <option value="booked">Booked</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="my-4">
            <label htmlFor="notes" className="mb-1 block text-gray-500 text-sm">
              Notes
            </label>
            <textarea
              ref={updateReservationNotesRef}
              name="notes"
              placeholder="Enter Notes Here..."
              className="w-full block h-24 text-sm border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
            ></textarea>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500"
              >
                Close
              </button>
              <button
                onClick={() => {
                  btnUpdate();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* update dialog */}
    </Page>
  );
}
