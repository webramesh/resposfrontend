import React, { useRef } from "react";
import Page from "../../components/Page";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { addNewTax, deleteTax, updateTax, useTaxes } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";

export default function TaxSetupPage() {

  const taxTitleAddRef = useRef();
  const taxRateAddRef = useRef();
  const taxTypeAddRef = useRef();

  const taxIdUpdateRef = useRef();
  const taxTitleUpdateRef = useRef();
  const taxRateUpdateRef = useRef();
  const taxTypeUpdateRef = useRef();

  const { APIURL, data: taxes, error, isLoading } = useTaxes();

  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }


  async function btnAdd () {
    const title = taxTitleAddRef.current.value;
    const rate = taxRateAddRef.current.value;
    const type = taxTypeAddRef.current.value;

    if(!title) {
      toast.error("Provide Title!");
      return;
    }
    if(rate < 0) {
      toast.error("Invalid value provided in Tax Rate!");
      return;
    }
    if(!type) {
      toast.error("Select Tax Type!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewTax(title, rate, type);

      if(res.status == 200) {
        taxTitleAddRef.current.value = null;
        taxRateAddRef.current.value = null;
        taxTypeAddRef.current.value = null;
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

  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteTax(id);

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

  const btnShowUpdate = async (id, title, rate, type) => {
    taxIdUpdateRef.current.value = id;
    taxTitleUpdateRef.current.value = title;
    taxRateUpdateRef.current.value = rate;
    taxTypeUpdateRef.current.value = type;
    document.getElementById('modal-update').showModal();
  };

  const btnUpdate = async () => {
    const id = taxIdUpdateRef.current.value
    const title = taxTitleUpdateRef.current.value
    const rate = taxRateUpdateRef.current.value 
    const type = taxTypeUpdateRef.current.value 

    if(!title) {
      toast.error("Please provide title!");
      return;
    }
    if(rate < 0) {
      toast.error("Invalid value provided in Tax Rate!");
      return;
    }
    if(!type) {
      toast.error("Select Tax Type!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateTax(id, title, rate, type);

      if(res.status == 200) {
        taxIdUpdateRef.current.value = null;
        taxTypeUpdateRef.current.value = null;
        taxRateUpdateRef.current.value = null;
        taxTitleUpdateRef.current.value = null;

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

  return (
    <Page className="px-8 py-6">
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light">Tax Setup</h3>
        <button onClick={()=>document.getElementById('modal-add').showModal()} className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1">
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>


      <div className="mt-8 w-full">
        <table className="w-full border overflow-x-auto">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start  md:w-20">
                #
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start  md:w-96">
                Title
              </th>

              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start  md:w-20">
                Rate
              </th>

              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start md:w-28">
                Type
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start md:w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax, index) => {
              const { id, title, rate, type } = tax;

              return (
                <tr key={index}>
                  <td className="px-3 py-2 text-start">{index+1}</td>
                  <td className="px-3 py-2 text-start">{title}</td>
                  <td className="px-3 py-2 text-start">{rate}%</td>
                  <td className="px-3 py-2 text-start">{type}</td>
                  <td className="px-3 py-2 text-start flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => {
                        btnShowUpdate(id, title, rate, type);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconPencil stroke={iconStroke} />
                    </button>
                    <button
                      onClick={()=>{
                        btnDelete(id);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconTrash stroke={iconStroke} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Tax</h3>
          
          <div className="mt-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Title</label>
            <input ref={taxTitleAddRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Tax Title" />
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label htmlFor="rate" className="mb-1 block text-gray-500 text-sm">Rate</label>
              <input ref={taxRateAddRef} type="number" name="rate" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Tax Rate" />
            </div>
            <div className="flex-1">
              <label htmlFor="type" className="mb-1 block text-gray-500 text-sm">Type</label>
              <select ref={taxTypeAddRef} name="type" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Select Tax Type" >
                <option value="" hidden>Select Tax Type</option>
                <option value="exclusive">Exclusive</option>
                <option value="inclusive">Inclusive</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnAdd();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>


      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Tax</h3>
          
          <div className="mt-4">
            <input type="hidden" ref={taxIdUpdateRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Title</label>
            <input ref={taxTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Tax Title" />
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label htmlFor="rate" className="mb-1 block text-gray-500 text-sm">Rate</label>
              <input ref={taxRateUpdateRef} type="number" name="rate" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Tax Rate" />
            </div>
            <div className="flex-1">
              <label htmlFor="type" className="mb-1 block text-gray-500 text-sm">Type</label>
              <select ref={taxTypeUpdateRef} name="type" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Select Tax Type" >
                <option value="" hidden>Select Tax Type</option>
                <option value="exclusive">Exclusive</option>
                <option value="inclusive">Inclusive</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnUpdate();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>

    </Page>
  )
}
