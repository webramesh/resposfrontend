import React from "react";
import Logo from "../assets/logo.svg";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../controllers/auth.controller";


export default function ForgotPasswordPage() {
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    
    if (!username) {
      e.target.username.focus();
      toast.error("Please provide username!");
      return;
    }

    try {
      toast.loading("Please wait...");

      const res = await forgotPassword(username);

      if(res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Error processing your request, Please try later!";
      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <div className="bg-restro-green-light relative overflow-x-hidden md:overflow-hidden">

      <img src="/assets/circle_illustration.svg" alt="illustration" className="absolute w-96 lg:w-[1024px] h-96 lg:h-[1024px]  lg:-bottom-96 lg:-right-52 -right-36 " />

      <div className="flex flex-col md:flex-row items-center justify-end md:justify-between gap-10 h-screen container mx-auto px-4 md:px-0 py-4 md:py-0 relative">
        <div>
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-dark">Cafe. Restaurant.</h3>
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-light outline-text">Hotel. Bar.</h3>
        </div>
        <div className="bg-white rounded-2xl px-8 py-8 w-full sm:w-96 mx-8 sm:mx-0 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-restro-green-dark text-xl font-medium">
              Forgot Password
            </div>
            <div>
              <img src={Logo} className="h-16" />
            </div>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block" htmlFor="username">
                Email
              </label>
              <input
                type="email"
                id="username"
                name="username"
                required
                placeholder="Enter Your email here..."
                className="mt-1 block w-full bg-gray-100 px-4 py-3 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="block w-full mt-6 bg-restro-green text-white rounded-xl px-4 py-3 transition hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-green-800/20"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
