import React, { useRef } from "react";
import Page from "../../components/Page";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconArmchair2,
  IconQrcode,
} from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { addNewStoreTable, deleteTable, updateStoreTable, useStoreSettings, useStoreTables } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { getTableQRMenuLink } from "../../helpers/QRMenuHelper";
import QRCode from "qrcode";

export default function TableSettingsPage() {

  const tableTitleRef = useRef();
  const tableFloorRef = useRef();
  const tableSeatingCapacityRef = useRef();

  const tableIdRef = useRef();
  const tableTitleUpdateRef = useRef();
  const tableFloorUpdateRef = useRef();
  const tableSeatingCapacityUpdateRef = useRef();

  const { data:storeSettings, error:errorStore, isLoading:isLoadingStore } = useStoreSettings();
  const { APIURL, data: storeTables, error, isLoading } = useStoreTables();

  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  if (isLoadingStore) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  const { uniqueQRCode, isQRMenuEnabled } = storeSettings

  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteTable(id);

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
    const title = tableTitleRef.current.value;
    const floor = tableFloorRef.current.value;
    const seatingCapacity = tableSeatingCapacityRef.current.value;

    if(!title) {
      toast.error("Please provide Title!");
      return;
    }
    if(!floor) {
      toast.error("Please provide Floor or use '-'");
      return;
    }
    if(!seatingCapacity) {
      toast.error("Please provide Seating Capacity or '0'");
      return;
    }

    if(seatingCapacity < 0) {
      toast.error("Please provide Valid Seating Capacity count or '0'");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewStoreTable(title, floor, seatingCapacity);

      if(res.status == 200) {
        tableTitleRef.current.value = null;
        tableFloorRef.current.value = null;
        tableSeatingCapacityRef.current.value = null;
        
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

  const btnShowUpdate = async (id, title, floor, seatingCapacity) => {
    tableIdRef.current.value = id;
    tableTitleUpdateRef.current.value = title;
    tableFloorUpdateRef.current.value = floor;
    tableSeatingCapacityUpdateRef.current.value = seatingCapacity;
    document.getElementById('modal-update').showModal();
  };

  const btnUpdate = async ()=>{
    const id = tableIdRef.current.value;
    const title = tableTitleUpdateRef.current.value;
    const floor = tableFloorUpdateRef.current.value;
    const seatingCapacity = tableSeatingCapacityUpdateRef.current.value;

    if(!title) {
      toast.error("Please provide Title!");
      return;
    }
    if(!floor) {
      toast.error("Please provide Floor or use '-'");
      return;
    }
    if(!seatingCapacity) {
      toast.error("Please provide Seating Capacity or '0'");
      return;
    }

    if(seatingCapacity < 0) {
      toast.error("Please provide Valid Seating Capacity count or '0'");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateStoreTable(id, title, floor, seatingCapacity);

      if(res.status == 200) {
        tableIdRef.current.value = null;
        tableTitleUpdateRef.current.value = null;
        tableFloorUpdateRef.current.value = null;
        tableSeatingCapacityUpdateRef.current.value = null;
        
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

  const btnDownloadTableMenuQR = async (tableId, title) => {
    try {
      if(!isQRMenuEnabled) {
        toast.error("Please enable QR menu from store settings!");
        return;
      }

      const QR_MENU_LINK = getTableQRMenuLink(uniqueQRCode, tableId)
      const qrDataURL = await QRCode.toDataURL(QR_MENU_LINK, {width: 1080});
      const link = document.createElement("a");

      const fileName = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

      link.download=`${fileName}-qr.png`;
      link.href=qrDataURL;
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Page className="px-8 py-6">
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light">Store Tables</h3>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-8 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {storeTables.map((storeTable, index) => {
          const { id, table_title, seating_capacity, floor, encrypted_id } = storeTable;

          return (
            <div
              key={id}
              className="border px-4 py-3 rounded-2xl flex flex-col gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <IconArmchair2 />
                </div>
                <div>
                  <p>
                    {table_title} - {floor}
                  </p>
                  <p className="text-gray-400">
                    Seating Capacity: {seating_capacity}
                  </p>
                </div>
                <div className="flex gap-0">
                  <button
                    onClick={() => {
                      btnShowUpdate(id, table_title, floor, seating_capacity);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                  >
                    <IconPencil stroke={iconStroke} />
                  </button>
                  <button
                    onClick={() => {btnDelete(id);}}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
                  >
                    <IconTrash stroke={iconStroke} />
                  </button>
                </div>
              </div>

              <button onClick={()=>{
                btnDownloadTableMenuQR(encrypted_id, table_title);
              }} className="btn btn-xs bg-gray-100 text-gray-500"><IconQrcode size={18} stroke={iconStroke} /> Download Table QR</button>
            </div>
          );
        })}
      </div>

      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Table</h3>
          
          <div className="mt-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Title</label>
            <input ref={tableTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Table Title" />
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label htmlFor="floor" className="mb-1 block text-gray-500 text-sm">Floor</label>
              <input ref={tableFloorRef} type="text" name="floor" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Floor Title" />
            </div>
            <div className="flex-1">
              <label htmlFor="capacity" className="mb-1 block text-gray-500 text-sm">Seating Capacity</label>
              <input ref={tableSeatingCapacityRef} type="number" min={0} name="capacity" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Seating Capcity" />
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
          <h3 className="font-bold text-lg">Update Table</h3>
          
          <div className="mt-4">
            <input type="hidden" ref={tableIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Title</label>
            <input ref={tableTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Table Title" />
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label htmlFor="floor" className="mb-1 block text-gray-500 text-sm">Floor</label>
              <input ref={tableFloorUpdateRef} type="text" name="floor" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Floor Title" />
            </div>
            <div className="flex-1">
              <label htmlFor="capacity" className="mb-1 block text-gray-500 text-sm">Seating Capacity</label>
              <input ref={tableSeatingCapacityUpdateRef} type="number" name="capacity" min={0} className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Seating Capcity" />
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
  );
}
