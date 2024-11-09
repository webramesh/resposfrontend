import { Fragment } from "react";
import AvatarImg from "../assets/avatar.png";
import { Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signOut } from "../controllers/superadmin.controller";
import {
  IconChevronDown,
  IconDevices,
  IconLifebuoy,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";

export default function SuperAdminAppBar() {
  const navigate = useNavigate();
  const user = getUserDetailsInLocalStorage();

  const btnLogout = async () => {
    try {
      toast.loading("Please wait...");
      const response = await signOut();
      if (response.status == 200) {
        toast.dismiss();
        toast.success(response.data.message);
        navigate("/superadmin", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong! Try later!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-restro-border-green-light w-full bg-white/90 backdrop-blur sticky top-0 z-[9999]">
      <div></div>

      {/* profile */}
      <Menu as="div" className="relative inline-block text-left z-50">
        <div>
          <Menu.Button className="text-sm bg-restro-green-light hover:bg-restro-green/30 transition text-restro-green-dark  rounded-full flex items-center gap-0 md:gap-2">
            <img
              src={AvatarImg}
              alt="avatar"
              className="w-10 h-10 rounded-full p-1"
            />
            <p className="font-medium hidden md:block">{user.name}</p>
            <IconChevronDown stroke={iconStroke} className="mr-1" size={18} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/superadmin/dashboard/contact-support"
                    className={`${
                      active
                        ? "bg-restro-green-light text-restro-green-dark"
                        : "text-restro-green-dark"
                    } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                  >
                    <IconLifebuoy stroke={iconStroke} />
                    Support
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={btnLogout}
                    className={`${
                      active ? "bg-red-100 text-red-400" : "text-red-400"
                    } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                  >
                    <IconLogout stroke={iconStroke} />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {/* profile */}
    </div>
  );
}
