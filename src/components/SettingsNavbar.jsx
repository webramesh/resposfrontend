import React from "react";
import { iconStroke } from "../config/config";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import {
  IconArmchair2,
  IconBook,
  IconCreditCard,
  IconDevices,
  IconInfoSquareRounded,
  IconLifebuoy,
  IconPrinter,
  IconReceiptTax,
} from "@tabler/icons-react";
export default function SettingsNavbar() {
  const { pathname } = useLocation();

  const items = [
    {
      icon: <IconInfoSquareRounded stroke={iconStroke} />,
      text: "Details",
      path: "/dashboard/settings",
    },
    {
      icon: <IconPrinter stroke={iconStroke} />,
      text: "Print Settings",
      path: "/dashboard/settings/print-settings",
    },
    {
      icon: <IconArmchair2 stroke={iconStroke} />,
      text: "Tables",
      path: "/dashboard/settings/tables",
    },
    {
      icon: <IconBook stroke={iconStroke} />,
      text: "Menu Items",
      path: "/dashboard/settings/menu-items",
    },
    {
      icon: <IconReceiptTax stroke={iconStroke} />,
      text: "Tax Setup",
      path: "/dashboard/settings/tax-setup",
    },
    {
      icon: <IconCreditCard stroke={iconStroke} />,
      text: "Payment Types",
      path: "/dashboard/settings/payment-types",
    },
    // {
    //   icon: <IconDevices stroke={iconStroke} />,
    //   text: "Devices",
    //   path: "/dashboard/settings/devices",
    // },
    // {
    //   icon: <IconLifebuoy stroke={iconStroke} />,
    //   text: "Contact Support",
    //   path: "/dashboard/settings/contact-support",
    // },
  ];

  return (
    <div className="w-20 md:w-60 h-screen overflow-y-auto border-r md:px-4 py-3 flex items-center flex-col gap-1 md:gap-3">
      {items.map((item, index) => {
        return (
          <Link to={item.path} key={index} className={clsx("w-12 h-12 md:w-full md:h-auto md:min-w-fit flex items-center justify-center md:justify-normal gap-1 md:px-4 md:py-3 rounded-full transition hover:bg-restro-border-green-light text-restro-green-dark", {
            "bg-restro-border-green-light font-medium": item.path == pathname,
          })}>
            {item.icon}
            <p className="hidden md:block">{item.text}</p>
          </Link>
        );
      })}
    </div>
  );
}
