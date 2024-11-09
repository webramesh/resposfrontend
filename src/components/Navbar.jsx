import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconArmchair2,
  IconChartArea,
  IconChefHat,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceIpadHorizontal,
  IconFileInvoice,
  IconFriends,
  IconLayoutDashboard,
  IconSettings2,
  IconToolsKitchen3,
  IconUsersGroup,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import Logo from "../assets/logo.svg";
import AvatarImg from "../assets/avatar.png";
import { iconStroke } from "../config/config";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
import { NavbarContext } from "../contexts/NavbarContext";
import { toggleNavbar } from "../helpers/NavbarSettings";
import { SCOPES } from "../config/scopes";

export default function Navbar() {
  const { pathname } = useLocation();
  const user = getUserDetailsInLocalStorage();
  const { role: userRole, scope } = user;
  const userScopes = scope?.split(",");

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useContext(NavbarContext);

  const navbarItems = [
    {
      type: "link",
      text: "Dashboard",
      icon: <IconLayoutDashboard stroke={iconStroke} />,
      path: "/dashboard/home",
      scopes: [SCOPES.DASHBOARD]
    },
    {
      type: "link",
      text: "POS",
      icon: <IconDeviceIpadHorizontal stroke={iconStroke} />,
      path: "/dashboard/pos",
      scopes: [SCOPES.POS]
    },
    {
      type: "link",
      text: "Orders",
      icon: <IconToolsKitchen3 stroke={iconStroke} />,
      path: "/dashboard/orders",
      scopes: [SCOPES.POS, SCOPES.ORDERS, SCOPES.ORDER_STATUS, SCOPES.ORDER_STATUS_DISPLAY]
    },
    {
      type: "link",
      text: "Kitchen",
      icon: <IconChefHat stroke={iconStroke} />,
      path: "/dashboard/kitchen",
      scopes: [SCOPES.KITCHEN, SCOPES.KITCHEN_DISPLAY]
    },

    {
      type: "text",
      text: "Offerings",
    },
    {
      type: "link",
      text: "Reservation",
      icon: <IconArmchair2 stroke={iconStroke} />,
      path: "/dashboard/reservation",
      scopes: [SCOPES.RESERVATIONS, SCOPES.VIEW_RESERVATIONS, SCOPES.MANAGE_RESERVATIONS]
    },
    {
      type: "link",
      text: "Customers",
      icon: <IconFriends stroke={iconStroke} />,
      path: "/dashboard/customers",
      scopes: [SCOPES.CUSTOMERS, SCOPES.VIEW_CUSTOMERS, SCOPES.MANAGE_CUSTOMERS]
    },
    {
      type: "link",
      text: "Invoices",
      icon: <IconFileInvoice stroke={iconStroke} />,
      path: "/dashboard/invoices",
      scopes: [SCOPES.INVOICES]
    },

    {
      type: "text",
      text: "Back Office",
    },
    {
      type: "link",
      text: "Users",
      icon: <IconUsersGroup stroke={iconStroke} />,
      path: "/dashboard/users",
      scopes: []
    },
    {
      type: "link",
      text: "Reports",
      icon: <IconChartArea stroke={iconStroke} />,
      path: "/dashboard/reports",
      scopes: [SCOPES.REPORTS]
    },
    {
      type: "link",
      text: "Settings",
      icon: <IconSettings2 stroke={iconStroke} />,
      path: "/dashboard/settings",
      scopes: [SCOPES.SETTINGS]
    },
  ];

  const btnToggleNavbar = () => {
    const isNavCollapsed = toggleNavbar();
    console.log(isNavCollapsed);
    if (isNavCollapsed) {
      setIsNavbarCollapsed(true);
    } else {
      setIsNavbarCollapsed(false);
    }
  };

  if (isNavbarCollapsed) {
    return (
      <div className="flex flex-col items-start gap-3 bg-restro-green-light h-screen px-5 py-6 overflow-y-auto fixed left-0 top-0">
        <img src={Logo} alt="logo" className="w-12 block mb-6" />
        {navbarItems.filter((navItem)=>{
          const requiredScopes = navItem.scopes;
          if(navItem.type=="link") {
            if(userRole == "admin") {
              return true;
            }

            return requiredScopes.some((scope)=>userScopes.includes(scope));
          }
        }).map((item, index) => {
          if (item.type == "text") {
            return;
          }

          return (
            <Link
              key={index}
              className={clsx(
                "w-12 h-12 flex items-center justify-center rounded-full transition hover:bg-restro-border-green-light text-restro-green-dark",
                {
                  "bg-restro-border-green-light font-medium": pathname.includes(
                    item.path
                  ),
                }
              )}
              to={item.path}
            >
              {item.icon}
            </Link>
          );
        })}

        <button
          onClick={btnToggleNavbar}
          className="w-12 h-12 flex items-center justify-center rounded-full transition hover:bg-restro-border-green-light text-restro-green-dark"
        >
          <IconChevronRight stroke={iconStroke} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="md:w-72 flex flex-col items-start gap-2 md:gap-3 bg-restro-green-light h-screen px-5 py-6 overflow-y-auto fixed left-0 top-0">
        <img src={Logo} alt="logo" className="w-12 md:w-auto md:h-14 block mb-2 md:mb-6 " />

        <div className="hidden md:flex items-center gap-2 w-full md:mb-6">
          <img
            src={AvatarImg}
            alt="avatar"
            className="md:w-12 md:h-12 rounded-full block"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">
              {new String(user.role).toUpperCase()}
              {user.designation && <span>, {user.designation}</span>}
            </p>
          </div>
        </div>

        {navbarItems.filter((navItem)=>{
          const requiredScopes = navItem.scopes;
          if(navItem.type=="text") {
            return true;
          }
          if(navItem.type=="link") {
            if(userRole == "admin") {
              return true;
            }

            return requiredScopes.some((scope)=>userScopes.includes(scope));
          }
        }).map((item, index) => {
          if (item.type == "text") {
            return (
              <p key={index} className="font-bold hidden md:block">
                {item.text}
              </p>
            );
          }

          return (
            <Link
              key={index}
              className={clsx(
                "w-12 h-12 md:w-full flex justify-center md:justify-normal items-center md:gap-1 md:px-4 md:py-3 rounded-full transition hover:bg-restro-border-green-light text-restro-green-dark",
                {
                  // "bg-restro-border-green-light font-medium": item.path == pathname,
                  "bg-restro-border-green-light font-medium": pathname.includes(
                    item.path
                  ),
                }
              )}
              to={item.path}
            >
              {item.icon} <p className="hidden md:block">{item.text}</p>
            </Link>
          );
        })}
      </div>

      <button
        onClick={btnToggleNavbar}
        className="w-9 h-9 hidden md:flex items-center justify-center rounded-full border transition bg-gray-100 hover:bg-gray-200 text-gray-500 fixed bottom-4 left-[17.5rem] -translate-x-1/2"
      >
        <IconChevronLeft stroke={iconStroke} size={18} />
      </button>
    </div>
  );
}
