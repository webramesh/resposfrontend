import React, { useRef } from "react";
import Page from "../../components/Page";
import { CURRENCIES } from "../../config/currencies.config";
import { saveStoreSettings, useStoreSettings } from "../../controllers/settings.controller";
import {toast} from "react-hot-toast"
import { mutate } from "swr";
import Popover from "../../components/Popover";
import { IconExternalLink, IconQrcode } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import QRCode from "qrcode";
import { getQRMenuLink } from "../../helpers/QRMenuHelper";

export default function SettingDetailsPage() {
  const storeNameRef = useRef();
  const addressRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const currencyRef = useRef();
  const isQRMenuEnabledRef = useRef();
  const isQROrderEnabledRef = useRef();

  const { APIURL, data, error, isLoading } = useStoreSettings();

  if(isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>
  }

  if(error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  const { storeName, email, address, phone, currency, isQRMenuEnabled, uniqueQRCode , isQROrderEnabled } = data;
  const QR_MENU_LINK = getQRMenuLink(uniqueQRCode);

  const btnSave = async () => {
    const storeName = storeNameRef.current.value;
    const address = addressRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const currency = currencyRef.current.value;
    const isQRMenuEnabled = isQRMenuEnabledRef.current.checked;
    const isQROrderEnabled = isQROrderEnabledRef.current.checked;

    try {

      toast.loading("Please wait...");
      const res = await saveStoreSettings(storeName, address, phone, email, currency, null, isQRMenuEnabled , isQROrderEnabled);

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

  const btnDownloadMenuQR = async () => {
    try {
      const qrDataURL = await QRCode.toDataURL(QR_MENU_LINK, {width: 1080});
      const link = document.createElement("a");
      link.download="qr.png";
      link.href=qrDataURL;
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Page className="px-8 py-6">
      <h3 className="text-3xl font-light">Store Details</h3>

      <div className="mt-8 text-sm text-gray-500">
        <div>
          <label htmlFor="name" className="block mb-1">
            Store Name
          </label>
          <input
            ref={storeNameRef}
            type="text"
            name="name"
            id="name"
            defaultValue={storeName}
            placeholder="Enter Store Name here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <textarea
            ref={addressRef}
            type="text"
            name="address"
            id="address"
            defaultValue={address}
            placeholder="Enter Store Address here..."
            className="block w-full h-20 lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            id="email"
            defaultValue={email}
            placeholder="Enter Email here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="phone" className="block mb-1">
            Phone
          </label>
          <input
            ref={phoneRef}
            type="tel"
            name="phone"
            id="phone"
            defaultValue={phone}
            placeholder="Enter Phone here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="currency" className="block mb-1">
            Currency
          </label>
          <select
            ref={currencyRef}
            name="currency"
            id="currency"
            defaultValue={currency}
            placeholder="Select Currency"
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
          >
            <option value="" hidden>
              Select Currency
            </option>
            {CURRENCIES.map((item, index) => {
              return (
                <option value={item.cc} key={index}>
                  {item.name} - ({item.symbol})
                </option>
              );
            })}
          </select>
        </div>

        <div className="w-full lg:min-w-96 flex items-center justify-between mt-4">
          <label htmlFor="qrmenu" className="flex items-center gap-2">
            Enable QR Menu
            <Popover text="This will enable digital menu which can be accessed via link and QR code!" />
          </label>

          {/* switch */}
          <label className="relative inline-flex items-center cursor-pointer no-drag">
            <input
              ref={isQRMenuEnabledRef}
              defaultChecked={isQRMenuEnabled}
              type="checkbox"
              name="qrmenu"
              id="qrmenu"
              value=""
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
          {/* switch */}
        </div>

        {
          isQRMenuEnabled && <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <button onClick={btnDownloadMenuQR} className="btn btn-sm">
              <IconQrcode stroke={iconStroke} /> Download QR Code
            </button>
            <a target="_blank" href={QR_MENU_LINK} className="btn btn-sm">
              <IconExternalLink stroke={iconStroke} /> View Digital Menu
            </a>
          </div>
        }

         <div className="w-full lg:min-w-96 flex items-center justify-between mt-4">
            <label htmlFor="qrorder" className="flex items-center gap-2">
              Enable Order Via QR Menu
              <Popover text="This will enable ordering via QR menu which can be accessed via link and QR code!" />
            </label>

            {/* switch */}
            <label className="relative inline-flex items-center cursor-pointer no-drag">
              <input
                ref={isQROrderEnabledRef}
                defaultChecked={isQROrderEnabled}
                type="checkbox"
                name="qrorder"
                id="qrorder"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
            {/* switch */}
          </div>

        <button onClick={btnSave} className="text-white w-full lg:min-w-96 bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-2 mt-6 outline-restro-border-green-light">
          Save
        </button>
      </div>
    </Page>
  );
}
