import React from "react";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { IconMenu } from "@tabler/icons-react";
export default function LNavbar() {
  const closeDrawer = () => {
    document.getElementById("my-drawer").checked = false;
  };

  return (
    <div className="w-full backdrop-blur-md sticky top-0 bg-white/80">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="flex items-center justify-between gap-4 container mx-auto px-4 py-3">
        <div>
          <img src={Logo} alt="logo" className="h-12" />
        </div>
        <div className="items-center hidden lg:flex">
          <a
            className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
            href="#features"
          >
            Features
          </a>
          <a
            className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
            href="#contact"
          >
            Contact
          </a>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Link
            className="hover:bg-gray-100 text-restro-green-dark rounded-full px-4 py-2 transition active:scale-95"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="hover:bg-restro-green-dark bg-restro-green text-white rounded-full px-4 py-2 transition active:scale-95"
            to="/register"
          >
            Get Started
          </Link>
        </div>

        {/* mobile btn */}
        <div className="block lg:hidden">
          
          <label
            aria-label="open sidebar"
            htmlFor="my-drawer"
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-500 transition"
          >
            <IconMenu />
          </label>
        </div>
        {/* mobile btn */}
      </div>

      {/* mobile menu */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className="mb-8">
            <img src={Logo} alt="logo" className="h-12" />
          </div>
          <li onClick={closeDrawer}>
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#features"
            >
              Features
            </a>
          </li>
          <li onClick={closeDrawer}>
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#pricing"
            >
              Pricing
            </a>
          </li>
          <li onClick={closeDrawer}>
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#contact"
            >
              Contact
            </a>
          </li>
          <li onClick={closeDrawer} className="mt-8">
            <Link
              className="hover:bg-gray-200 border text-center block text-restro-green-dark rounded-full px-4 py-2 transition active:scale-95"
              to="/login"
            >
              Login
            </Link>
          </li>
          <li onClick={closeDrawer} className="mt-4">
            <Link
              className="hover:bg-restro-green-dark block text-center bg-restro-green text-white rounded-full px-4 py-2 transition active:scale-95"
              to="/register"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
      {/* mobile menu */}
    </div>
  );
}
