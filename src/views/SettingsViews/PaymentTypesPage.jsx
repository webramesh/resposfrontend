import React, { useRef } from "react";
import Page from "../../components/Page";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { addNewPaymentType, deletePaymentType, togglePaymentType, updatePaymentType, usePaymentTypes } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";

export default function PaymentTypesPage() {
  const paymentTypeAddRef = useRef();

  const paymentTypeIdUpdateRef = useRef();
  const paymentTypeTitleUpdateRef = useRef();
  const paymentTypeIsActiveUpdateRef = useRef();

  const { APIURL, data: paymentTypes, error, isLoading } = usePaymentTypes();

  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deletePaymentType(id);

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

  const btnShowUpdate = async (id, title, isActive) => {
    paymentTypeIdUpdateRef.current.value = id;
    paymentTypeIsActiveUpdateRef.current.checked = isActive;
    paymentTypeTitleUpdateRef.current.value = title;
    document.getElementById('modal-update').showModal();
  };

  const btnUpdate = async () => {
    const id = paymentTypeIdUpdateRef.current.value
    const title = paymentTypeTitleUpdateRef.current.value
    const isActive = paymentTypeIsActiveUpdateRef.current.checked

    if(!title) {
      toast.error("Please provide title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updatePaymentType(id, title, isActive);

      if(res.status == 200) {
        paymentTypeIdUpdateRef.current.value = null;
        paymentTypeIsActiveUpdateRef.current.checked = null;
        paymentTypeTitleUpdateRef.current.value = null;

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

  const toggle = async (id, value) => {
    try {
      toast.loading("Please wait...");
      const res = await togglePaymentType(id, value);

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

  async function btnAdd() {
    const paymentType = paymentTypeAddRef.current.value;

    if(!paymentType) {
      toast.error("Please provide Payment Type Title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewPaymentType(paymentType, true);

      if(res.status == 200) {
        paymentTypeAddRef.current.value = "";
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
        <h3 className="text-3xl font-light">Payment Types</h3>
        <button onClick={()=>document.getElementById('modal-add').showModal()} className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1">
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-8 w-full">
        <table className="w-full border overflow-x-auto">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-20">
                #
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-96">
                Title
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentTypes.map((paymentType, index) => {
              const { id, title, is_active } = paymentType;

              return (
                <tr key={index}>
                  <td className="px-3 py-2 text-start">{index+1}</td>
                  <td className="px-3 py-2 text-start">{title}</td>
                  <td className="px-3 py-2 text-start flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => {
                        btnShowUpdate(id, title, is_active);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconPencil stroke={iconStroke} />
                    </button>
                    <button
                      onClick={()=>{btnDelete(id);}}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconTrash stroke={iconStroke} />
                    </button>

                    {/* switch */}
                    <label className="relative flex items-center cursor-pointer no-drag">
                      <input
                        onChange={(e) => toggle(id, e.target.checked)}
                        defaultChecked={is_active}
                        checked={is_active}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    </label>
                    {/* switch */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Payment Type</h3>
          
          <div className="my-4">
            <label htmlFor="paymentType" className="mb-1 block text-gray-500 text-sm">Payment Type Title</label>
            <input ref={paymentTypeAddRef} type="text" name="paymentType" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Payment Type" />
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
          <h3 className="font-bold text-lg">Update Payment Type</h3>
          
          <div className="mt-4">
            <input type="hidden" ref={paymentTypeIdUpdateRef} />
            <label htmlFor="paymentTypeUpdate" className="mb-1 block text-gray-500 text-sm">Payment Type Title</label>
            <input ref={paymentTypeTitleUpdateRef} type="text" name="paymentTypeUpdate" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Payment Type" />
          </div>

          <div className="mt-4 flex items-center justify-between w-full">
            <label htmlFor="isActivePaymentUpdate" className="block text-gray-500 text-sm">Active?</label>
            {/* switch */}
            <label className="relative flex items-center cursor-pointer no-drag">
              <input
                ref={paymentTypeIsActiveUpdateRef}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
            {/* switch */}
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnUpdate()}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>
    </Page>
  );
}
