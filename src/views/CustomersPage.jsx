import React, { useRef, useState } from "react";
import Page from "../components/Page";
import {
  IconCalendarPlus,
  IconCalendarTime,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconMail,
  IconPhone,
  IconPlus,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import DialogAddCustomer from "../components/DialogAddCustomer";
import { deleteCustomer, updateCustomer, useCustomers } from "../controllers/customers.controller";
import {clsx} from "clsx";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
import { SCOPES } from "../config/scopes";
import { validateEmail } from "../utils/emailValidator";
import { validatePhone } from "../utils/phoneValidator";

export default function CustomersPage() {
  const { role, scope } = getUserDetailsInLocalStorage();
  const userScopes = scope?.split(",");
  let isManageAllowed = false;
  if(role == "admin") {
    isManageAllowed = true;
  } else {
    if(userScopes.includes(SCOPES.CUSTOMERS) || userScopes.includes(SCOPES.MANAGE_CUSTOMERS)) {
      isManageAllowed = true;
    }
  }

  const phoneRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const genderRef = useRef();
  const birthDateRef = useRef();

  const searchRef = useRef();
  const [state, setState] = useState({
    spage: 1,
    search: ""
  });
  const { APIURL, data, error, isLoading } = useCustomers({
    page: state.spage,
    perPage: 10,
    filter: state.search
  });

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page>Error loading details! Please Try Later!</Page>;
  }

  const { customers, currentPage, totalPages, totalCustomers } = data;

  // pagination
  const btnPaginationFirstPage = () => {
    setState({
      ...state,
      spage: 1,
    })
  };
  const btnPaginationLastPage = () => {
    setState({
      ...state,
      spage: totalPages,
    })
  };
  const btnPaginationNextPage = () => {
    if(currentPage == totalPages) {
      return;
    }
    setState({
      ...state,
      spage: state.spage + 1,
    })
  };
  const btnPaginationPreviousPage = () => {
    if(currentPage == 1) {
      return;
    }
    setState({
      ...state,
      spage: state.spage - 1,
    })
  };
  // pagination


  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteCustomer(id);

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
  };

  const btnSearch = () => {
    const searchQuery = searchRef.current.value;
    if(!new String(searchQuery).trim()) {
      return;
    }

    setState({
      ...state,
      search: searchQuery,
      spage: 1
    });
  };
  const btnClearSearch = () => {
    searchRef.current.value = null;

    setState({
      ...state,
      search: "",
      spage: 1
    });
  };


  const btnShowUpdate = (phone, name, email, birthDate, gender) => {
    phoneRef.current.value = phone;
    nameRef.current.value = name;
    emailRef.current.value = email;

    const bDate = new Date(birthDate);

    birthDateRef.current.value = birthDate ? `${bDate.getFullYear()}-${(bDate.getMonth()+1).toString().padStart("2", '0')}-${bDate.getDate().toString().padStart("2", '0')}` : null;
    genderRef.current.value = gender;

    document.getElementById("modal-update-customer").showModal()
  };

  async function btnUpdate() {
    const phone = phoneRef.current.value;
    const name = nameRef.current.value;
    const email = emailRef.current.value || null;
    const gender = genderRef.current.value || null;
    const birthDate = birthDateRef.current.value || null;

    if(!phone) {
      toast.error("Please Provide Customer's Phone!");
      return;
    }

    if(!name) {
      toast.error("Please Provide Customer's Name!");
      return;
    }

    if(email) {
      if(!validateEmail(email)) {
        toast.error("Please Provide Valid Email!");
        return;
      }
    }
    if(!validatePhone(phone)) {
      toast.error("Please provide valid phone no.!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateCustomer(phone, name, email, birthDate, gender);

      if(res.status == 200) {
        phoneRef.current.value = null;
        nameRef.current.value = null;
        emailRef.current.value = null;
        genderRef.current.value = null;
        birthDateRef.current.value = null;

        await mutate(APIURL);

        toast.dismiss();
        toast.success(res.data.message);
        document.getElementById('modal-update-customer').close();
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
      <div className="flex flex-wrap gap-4 flex-col md:flex-row items-center justify-between">
        <div className="flex gap-6">
          <h3 className="text-2xl">Customers</h3>
          {isManageAllowed && <button
            onClick={() =>
              document.getElementById("modal-add-customer").showModal()
            }
            className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
          >
            <IconPlus size={22} stroke={iconStroke} /> New
          </button>}
        </div>

        <div className="flex gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded-lg flex items-center">
            <input
              ref={searchRef}
              defaultValue={state.search}
              type="text"
              placeholder="Search Customer"
              className="bg-transparent placeholder:text-gray-400 outline-none block"
            />
            {state.search && <button onClick={btnClearSearch} className="text-gray-400">
              <IconX stroke={iconStroke} size={18} />
            </button>}
          </div>
          <button onClick={btnSearch} className="text-white bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-1 outline-restro-border-green-light">
            Search
          </button>
        </div>
      </div>

      {customers?.length == 0 && (
        <div className="w-full h-[calc(100vh-15vh)] flex gap-4 flex-col items-center justify-center">
          <img
            src="/assets/illustrations/no-customers.svg"
            alt="no customers"
            className="w-full md:w-60"
          />
          <p className="text-gray-400">No Customers Found!</p>
        </div>
      )}

      {
        customers?.length > 0 && <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {
          customers.map((customer, index)=>{
            const {phone, name, email, gender, birth_date, created_at, updated_at} = customer;

            return (<div key={phone} className="border border-restro-border-green-light rounded-2xl px-4 py-5">
              <div className="flex items-center gap-2">
                <div className="flex w-12 h-12 rounded-full items-center justify-center bg-gray-100 text-gray-400">
                  <IconUser/>
                </div>
                <div>
                  <p>{name}</p>
                  <p className="text-sm flex items-center gap-1 text-gray-500"><IconPhone stroke={iconStroke} size={18}/> {phone}</p>
                </div>
              </div>

              {email && <p className="mt-4 text-sm flex flex-wrap items-center gap-1 text-gray-500 truncate "><IconMail stroke={iconStroke} size={18}/> {email}</p>}
              {birth_date && <p className="text-sm flex items-center gap-1 text-gray-500">Birth Date: {new Date(birth_date).toLocaleDateString()}</p>}
              {gender && <p className="text-sm flex items-center gap-1 text-gray-500">Gender: {gender}</p>}

              <div className="mt-4 text-sm flex items-center gap-1 text-gray-500"><IconCalendarPlus stroke={iconStroke} size={18}/> {new Date(created_at).toLocaleString()}</div>
              {updated_at && <div className="text-sm flex items-center gap-1 text-gray-500"><IconCalendarTime stroke={iconStroke} size={18}/> {new Date(updated_at).toLocaleString()}</div>}

              <div className="flex gap-4 mt-4">
                <button onClick={()=>{btnShowUpdate(phone, name, email, birth_date, gender)}} className="btn btn-sm text-gray-500 flex-1">Edit</button>
                <button onClick={()=>{btnDelete(phone)}} className="btn text-red-400 btn-sm flex-1">Delete</button>
              </div>
            </div>
            )
          })
        }
      </div>
      }

      {/* pagination */}
      <div className="flex justify-end mt-8">
        <div className="join">
          <button onClick={btnPaginationFirstPage} className={
            clsx("join-item btn btn-sm bg-gray-100 text-gray-500", {
              "btn-disabled": currentPage == 1
            })
          }>
            <IconChevronsLeft stroke={iconStroke} />
          </button>
          <button onClick={btnPaginationPreviousPage} className={
            clsx("join-item btn btn-sm bg-gray-100 text-gray-500", {
              "btn-disabled": currentPage == 1
            })
          }>
            <IconChevronLeft stroke={iconStroke} />
          </button>
          <button className="join-item btn btn-sm bg-gray-100 text-gray-500">
            Page {currentPage}
          </button>
          <button onClick={btnPaginationNextPage} className={
            clsx("join-item btn btn-sm bg-gray-100 text-gray-500", {
              "btn-disabled": currentPage == totalPages
            })
          }>
            <IconChevronRight stroke={iconStroke} />
          </button>
          <button onClick={btnPaginationLastPage} className={
            clsx("join-item btn btn-sm bg-gray-100 text-gray-500", {
              "btn-disabled": currentPage == totalPages
            })
          }>
            <IconChevronsRight stroke={iconStroke} />
          </button>
        </div>
      </div>
      <div className="text-end mt-4">
        <p>
          Showing {customers.length} of {totalCustomers}
        </p>
      </div>
      {/* pagination */}

      {/* add dialog */}
      <DialogAddCustomer APIURL={APIURL} />
      {/* add dialog */}

      {/* update dialog */}
      <dialog
      id="modal-update-customer"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Update Customer</h3>

        <div className="mt-4">
          <label htmlFor="phone" className="mb-1 block text-gray-500 text-sm">
            Phone <span className="text-xs text-gray-400">- (Required)</span>
          </label>
          <input
            ref={phoneRef}
            type="tel"
            name="phone"
            disabled
            className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 disabled:text-gray-400 outline-restro-border-green-light cursor-not-allowed"
            placeholder="Enter Customer's Phone No."
          />
        </div>

        <div className="mt-4">
          <label htmlFor="name" className="mb-1 block text-gray-500 text-sm">
            Name <span className="text-xs text-gray-400">- (Required)</span>
          </label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
            placeholder="Enter Customer's Name"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="mb-1 block text-gray-500 text-sm">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
            placeholder="Enter Customer's Email"
          />
        </div>

        <div className="flex gap-4 w-full my-4">
          <div className="flex-1">
            <label htmlFor="birthdate" className="mb-1 block text-gray-500 text-sm">
              Birth Date
            </label>
            <input
              ref={birthDateRef}
              type="date"
              name="birthdate"
              max={new Date().toISOString().substring(0, 10)}
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Select Birth Date"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="type" className="mb-1 block text-gray-500 text-sm">
              Gender
            </label>
            <select
              ref={genderRef}
              name="type"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Select Tax Type"
            >
              <option value="">
                Select Gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
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
