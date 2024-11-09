import React from "react";
import LNavbar from "./LNavbar";
import { Link } from "react-router-dom";
import {
  IconChefHat,
  IconDeviceIpadHorizontal,
  IconDeviceTablet,
  IconLayout,
} from "@tabler/icons-react";
import Logo from "../../assets/logo.svg";
import { subscriptionPrice } from "../../config/config";

export default function LadingPage() {
  return (
    <div className="w-full">
      {/* navbar */}
      <LNavbar />
      {/* navbar */}

      {/* hero */}
      <div className="w-full container mx-auto flex flex-col items-center mt-40 px-6 lg:px-0">
        <h3 className="text-3xl lg:text-5xl font-bold text-center">All-in-One POS</h3>
        <h3 className="text-3xl lg:text-5xl font-bold text-center">
          for <span className="text-restro-green">Your Food & Beverage</span>{" "}
          Business.
        </h3>

        <p className="text-gray-500 mt-8 text-center">
          Effortless POS. Unparalleled Growth. RestroPRO POS empowers you with
          the tools you need to streamline operations, increase staff
          productivity, and gain valuable customer insights. Make data-driven
          decisions, optimize your menu, and watch your foodservice business
          flourish.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link
            className="hover:bg-restro-green-dark bg-restro-green text-lg text-white rounded-full px-5 py-3 transition active:scale-95"
            to="/login"
          >
            Get Started
          </Link>
          <a
            className="hover:bg-gray-100 text-restro-green-dark text-lg rounded-full px-5 py-3 transition active:scale-95"
            href="#pricing"
          >
            View Pricing
          </a>
        </div>
      </div>
      <img
        src="/assets/hero.webp"
        alt="restro pro image"
        className="w-full block"
      />
      {/* hero */}

      {/* features */}
      <h3 className="text-4xl font-bold text-center container mx-auto mt-40">
        Features
      </h3>
      <div
        id="features"
        className="w-full container mx-auto grid grid-cols-1 lg:grid-cols-3 my-20 gap-10 px-6 lg:px-0"
      >
        <div className="rounded-2xl px-8 py-6 border flex flex-col items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-restro-green bg-green-100">
            <IconLayout />
          </div>
          <h3 className="mt-4 font-bold text-2xl text-center">Minimal UI</h3>
          <p className="text-gray-700 mt-2 text-center">
            Effortless Interface, RestroPRO POS boasts a clean and intuitive
            design. No cluttered screens, just the essentials you need to manage
            your business with ease.
          </p>
        </div>

        <div className="rounded-2xl px-8 py-6 border flex flex-col items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-restro-green bg-green-100">
            <IconDeviceIpadHorizontal />
          </div>
          <h3 className="mt-4 font-bold text-2xl text-center">POS</h3>
          <p className="text-gray-700 mt-2 text-center">
            RestroPRO POS simplifies sales. Manage orders, categories & variants
            with ease. Send to kitchen instantly & accept payments securely.
            All-in-one for a smooth flow.
          </p>
        </div>

        <div className="rounded-2xl px-8 py-6 border flex flex-col items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-restro-green bg-green-100">
            <IconChefHat />
          </div>
          <h3 className="mt-4 font-bold text-2xl text-center">Live Updates</h3>
          <p className="text-gray-700 mt-2 text-center">
            Kitchen in Sync, Never miss a beat. Live order updates send details
            directly to your kitchen, ensuring accuracy and minimizing prep
            time.
          </p>
        </div>
      </div>
      {/* features */}

      {/* pricing */}
      <h3 className="text-4xl font-bold text-center container mx-auto mt-40">
        Pricing
      </h3>
      <div
        id="pricing"
        className="w-full container mx-auto grid grid-cols-1 my-20 gap-10 place-items-center px-6 lg:px-0"
      >
        <div className="rounded-2xl px-8 py-6 border flex flex-col w-full lg:w-96">
          <h3 className="text-4xl text-green-700 font-bold text-center">{subscriptionPrice}</h3>
          <h3 className=" font-bold text-2xl text-center">per month</h3>
          <ul className="text-gray-700 mt-6 flex flex-col gap-2 text-start">
            <li>✅ Unlimited Orders</li>
            <li>✅ Monthly Renewls</li>
            <li>✅ Unlimited Devices</li>
            <li>✅ Live Kitchen Orders</li>
          </ul>
        </div>
      </div>
      {/* pricing */}

      {/* contact */}
      <div id="contact" className="container mx-auto my-40 px-6 lg:px-0">
        <div
          className="lg:h-40 px-10 py-6 flex gap-4 flex-col md:flex-row lg:items-center rounded-3xl bg-restro-green-dark text-restro-green shadow-2xl shadow-green-700/40"
        >
          <h3 className="flex-1 font-bold text-4xl text-white">
            Have any queries?
          </h3>
          <a
            className="bg-white text-lg text-restro-green-dark rounded-full px-5 py-3 transition active:scale-95 block"
            href="mailto:hi@uiflow.in"
          >
            Contact us
          </a>
        </div>
      </div>
      
      {/* contact */}

      {/* footer */}
      <div className="w-full border-t">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 container mx-auto px-4 py-3">
          <div>
            <img src={Logo} alt="logo" className="h-12" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center">
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#"
            >
              Refund Policy
            </a>
            <a
              className="hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2 transition active:scale-95"
              href="#"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
      {/* footer */}
    </div>
  );
}
