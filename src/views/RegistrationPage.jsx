import React, { useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { SCOPES } from "../config/scopes";
import { signUp } from "../controllers/auth.controller";
import { validateEmail } from "../utils/emailValidator";
export default function RegistrationPage() {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bizName = e.target.biz_name.value;
    const email = e.target.username.value;
    const password = e.target.password.value;

    if(!bizName) {
      toast.error("Please provide business name!");
      return;
    }

    if(!email) {
      toast.error("Please provide email!");
      return;
    }

    if(!password) {
      toast.error("Please provide password!");
      return;
    }

    if(!validateEmail(email)) {
      toast.error("Please provide valid email!");
      return;
    }

    try {
      toast.loading("Please wait...");

      const res = await signUp(bizName, email, password);
      toast.dismiss();
      if (res.status == 200) {
        toast.success(res.data.message);
        navigate("/login", {
          replace: true
        })
        return;
      } else {
        const message = res.data.message;
        toast.dismiss();
        toast.error(message);
        return;
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "We're getting issues while processing the request, try later!";

      toast.dismiss();
      toast.error(message);
      return;
    }
  }

  return (
    <div className="bg-restro-green-light relative overflow-x-hidden md:overflow-hidden">

      <img src="/assets/circle_illustration.svg" alt="illustration" className="absolute w-96 lg:w-[1024px] h-96 lg:h-[1024px]  lg:-bottom-96 lg:-right-52 -right-36 " />

      <div className="flex flex-col md:flex-row items-center justify-end md:justify-between gap-10 h-screen container mx-auto px-4 md:px-0 py-4 md:py-0 relative">
        <div className="lg:block hidden">
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-dark">Signup Today &</h3>
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-light outline-text">Increase Productivity</h3>
        </div>
        <div className="bg-white rounded-2xl px-8 py-8 w-full sm:w-96 mx-8 sm:mx-0 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-restro-green-dark text-xl font-medium">
              Register
            </div>
            <div>
              <img src={Logo} className="h-16" />
            </div>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="">
              <label className="block" htmlFor="biz_name">
                Business Name
              </label>
              <input
                type="text"
                id="biz_name"
                name="biz_name"
                required
                placeholder="Enter Your Business Name here..."
                className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="username">
                Email
              </label>
              <input
                type="email"
                id="username"
                name="username"
                required
                placeholder="Enter Your Email here..."
                className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter Your Password here..."
                className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="block w-full mt-6 bg-restro-green text-white rounded-xl px-4 py-3 transition hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-green-800/20"
            >
              Register
            </button>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-b"></div>
              <p className="text-sm text-gray-400">OR</p>
              <div className="flex-1 border-b"></div>
            </div>

            <Link
              to="/login"
              className="block w-full text-center bg-slate-100 text-slate-500 rounded-xl px-4 py-3 transition hover:scale-105 active:scale-95 hover:shadow-xl hover:bg-slate-200 hover:shadow-slate-800/10"
            >
              Signin
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
}
