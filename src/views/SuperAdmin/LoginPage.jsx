import React, { useEffect } from "react";
import Logo from "../../assets/logo.svg";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { isRestroUserAuthenticated } from "../../helpers/AuthStatus";
import {
  getUserDetailsInLocalStorage,
  saveUserDetailsInLocalStorage,
} from "../../helpers/UserDetails";
import { signIn } from "../../controllers/superadmin.controller";

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const restroAuthenticated = isRestroUserAuthenticated();
    if (restroAuthenticated) {
      const { role } = getUserDetailsInLocalStorage();
      if (role == "superadmin") {
        navigate("/superadmin/dashboard/home", {
          replace: true,
        });
        return;
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username) {
      e.target.username.focus();
      toast.error("Please provide username!");
      return;
    }

    if (!password) {
      e.target.password.focus();
      toast.error("Please provide password!");
      return;
    }

    try {
      toast.loading("Please wait...");

      const res = await signIn(username, password);

      if (res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);

        const user = res.data.user;
        saveUserDetailsInLocalStorage(user);

        const { role } = getUserDetailsInLocalStorage();
        navigate("/superadmin/dashboard/home", {
          replace: true,
        });
        return;
      } else {
        const message = res.data.message;
        toast.dismiss();
        toast.error(message);
        return;
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Something went wrong!";

      toast.dismiss();
      toast.error(message);
      return;
    }
  };

  return (
   <div className="bg-restro-green-light relative overflow-x-hidden md:overflow-hidden">

      <img src="/assets/circle_illustration.svg" alt="illustration" className="absolute w-96 lg:w-[1024px] h-96 lg:h-[1024px]  lg:-bottom-96 lg:-right-52 -right-36 " />

      <div className="flex flex-col md:flex-row items-center justify-end md:justify-between gap-10 h-screen container mx-auto px-4 md:px-0 py-4 md:py-0 relative">
        <div>
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-dark">SuperAdmin</h3>
          <h3 className="text-2xl lg:text-6xl font-black text-restro-green-light outline-text">Login.</h3>
        </div>
        <div className="bg-white rounded-2xl px-8 py-8 w-full sm:w-96 mx-8 sm:mx-0 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-restro-green-dark text-xl font-medium">
              Login
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
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="block" htmlFor="password">
                  Password
                </label>
              </div>
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
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
