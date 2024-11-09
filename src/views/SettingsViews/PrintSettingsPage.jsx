import React, { useRef } from "react";
import Page from "../../components/Page";
import {
  savePrintSettings,
  usePrintSettings,
} from "../../controllers/settings.controller";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import Popover from "../../components/Popover";

export default function PrintSettingsPage() {
  const enablePrintRef = useRef();
  const showStoreDetailsRef = useRef();
  const showCustomerDetailsRef = useRef();
  const pageSizeRef = useRef();
  const headerRef = useRef();
  const footerRef = useRef();
  const showNotesRef = useRef();
  const printTokenRef = useRef();

  const { APIURL, data, error, isLoading } = usePrintSettings();

  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  const {
    pageFormat,
    header,
    footer,
    showNotes,
    isEnablePrint,
    showStoreDetails,
    showCustomerDetails,
    printToken,
  } = data;

  const btnSave = async () => {
    const enablePrint = enablePrintRef.current.checked;
    const showStoreDetails = showStoreDetailsRef.current.checked;
    const showCustomerDetails = showCustomerDetailsRef.current.checked;
    const pageSize = pageSizeRef.current.value;
    const header = headerRef.current.value;
    const footer = footerRef.current.value;
    const showNotes = showNotesRef.current.checked;
    const printToken = printTokenRef.current.checked;

    try {

      toast.loading("Please wait...");
      const res = await savePrintSettings(pageSize, header, footer, showNotes, enablePrint, showStoreDetails, showCustomerDetails, printToken);

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

  return (
    <Page className="px-8 py-6">
      <h3 className="text-3xl font-light">Print Settings</h3>

      <div className="mt-8 text-gray-500 text-sm">
        <div className="w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="enablePrint" className="flex items-center gap-2">
            Enable Print
            <Popover text="This will Print Receipt when you create order!" />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={enablePrintRef}
              defaultChecked={isEnablePrint}
              type="checkbox"
              name="enablePrint"
              id="enablePrint"
              value=""
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="showStoreDetails" className="flex items-center gap-2">
            Show Store Details
            <Popover text="Details like Address, Name, Phone will appear in Receipt!" />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showStoreDetailsRef}
              defaultChecked={showStoreDetails}
              type="checkbox"
              value=""
              name="showStoreDetails"
              id="showStoreDetails"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label
            htmlFor="showCustomerDetails"
            className="flex items-center gap-2"
          >
            Show Customer Details
            <Popover text="Customer Name, Phone, etc. will appear in Receipt!" />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showCustomerDetailsRef}
              defaultChecked={showCustomerDetails}
              type="checkbox"
              value=""
              name="showCustomerDetails"
              id="showCustomerDetails"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96">
          <label htmlFor="pageSize" className="block mb-1">
            Format (Page Size)
          </label>
          <select
            ref={pageSizeRef}
            defaultValue={pageFormat}
            name="pageSize"
            id="pageSize"
            className="block w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 outline-restro-border-green-light"
          >
            <option hidden value="">
              Select Page Size
            </option>
            <option value="80">80mm</option>
            <option value="57">57mm</option>
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="header" className="block mb-1">
            Header
          </label>
          <textarea
            ref={headerRef}
            defaultValue={header}
            type="text"
            name="header"
            id="header"
            placeholder="Enter Header here..."
            className="block w-full h-20 lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="footer" className="block mb-1">
            Footer
          </label>
          <textarea
            ref={footerRef}
            defaultValue={footer}
            type="text"
            name="footer"
            id="footer"
            placeholder="Enter Footer here..."
            className="block w-full h-20 lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="showNotes" className="flex items-center gap-2">
            Show Notes
            <Popover text="Extra notes will appear in Receipt!" />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={showNotesRef}
              defaultChecked={showNotes}
              type="checkbox"
              value=""
              name="showNotes"
              id="showNotes"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        <div className="mt-4 w-full lg:min-w-96 flex items-center justify-between">
          <label htmlFor="printToken" className="flex items-center gap-2">
            Print Token
            <Popover text="Along with receipt, the token number is printed for maintaining queue in your store, and this will be given to Kitchen as well. Every day token number will be resetted automatically." />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={printTokenRef}
              defaultChecked={printToken}
              type="checkbox"
              value=""
              name="printToken"
              id="printToken"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        <button
          onClick={btnSave}
          className="text-white w-full lg:min-w-96 bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-2 mt-6 outline-restro-border-green-light"
        >
          Save
        </button>
      </div>
    </Page>
  );
}
