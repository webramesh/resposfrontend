import React, { useRef, useState } from "react";
import Page from "../components/Page";
import {
  IconInfoCircle,
  IconInfoCircleFilled,
  IconMail,
  IconPhone,
  IconPlus,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import { SCOPES } from "../config/scopes";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { addNewUser, deleteUser, resetUserPassword, updateUser, useUsers } from "../controllers/users.controller";
import { validateEmail } from "../utils/emailValidator";


export default function UsersPage() {
  const [state, setState] = useState({
    selectedScopes: [],
  });

  const nameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const designationRef = useRef();

  const changePasswordModalUsernameRef = useRef();
  const changePasswordModalNewPasswordRef = useRef();

  const nameUpdateRef = useRef();
  const usernameUpdateRef = useRef();
  const phoneUpdateRef = useRef();
  const emailUpdateRef = useRef();
  const designationUpdateRef = useRef();

  const { APIURL, data: users, error, isLoading } = useUsers();

  if (isLoading) {
    return <Page>Loading...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page>Error Loading details! Please try later!</Page>;
  }

  const { selectedScopes } = state;

  const btnAdd = async () => {
    const name = nameRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const phone = phoneRef.current.value || null;
    const designation = designationRef.current.value || null;

    const userScopes = selectedScopes;

    if (!name) {
      toast.error("Please provide name!");
      return;
    }
    if (!username) {
      toast.error("Please provide username!");
      return;
    }
    if (!password) {
      toast.error("Please provide password!");
      return;
    }
    if(!validateEmail(username)) {
      toast.error("Please provide valid email!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewUser(
        username,
        password,
        name,
        designation,
        phone,
        null,
        userScopes
      );

      if (res.status == 200) {
        nameRef.current.value = null;
        usernameRef.current.value = null;
        passwordRef.current.value = null;
        phoneRef.current.value = null;
        designationRef.current.value = null;

        await mutate(APIURL);

        setState({
          ...state,
          selectedScopes: [],
        });

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

  const btnDelete = async (username) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteUser(username);

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

  const btnShowChangePassword = (username) => {
    changePasswordModalUsernameRef.current.value = username;
    document.getElementById("modal-reset-password").showModal()
  };

  const btnChangePassword = async () => {
    const username = changePasswordModalUsernameRef.current.value;
    const password = changePasswordModalNewPasswordRef.current.value;

    if(!(username)) {
      toast.error("Invalid Request!");
      return;
    }
    if(!(password)) {
      toast.error("Provide new password!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await resetUserPassword(
        username,
        password,
      );

      if (res.status == 200) {
        
        changePasswordModalUsernameRef.current.value = null;
        changePasswordModalNewPasswordRef.current.value = null;
        
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

  const btnShowUpdate = (username, name, phone, email, designation, scope) => {
    usernameUpdateRef.current.value = username;
    nameUpdateRef.current.value = name;
    phoneUpdateRef.current.value = phone;
    designationUpdateRef.current.value = designation;

    setState({
      ...state,
      selectedScopes: scope ? new String(scope).split(",") : []
    })

    document.getElementById("modal-update").showModal()
  };

  const btnUpdate = async () => {
    const username = usernameUpdateRef.current.value;
    const name = nameUpdateRef.current.value;
    const phone = phoneUpdateRef.current.value;
    const designation = designationUpdateRef.current.value;

    const userScopes = selectedScopes;

    if (!name) {
      toast.error("Please provide name!");
      return;
    }
    if (!username) {
      toast.error("Please provide username!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateUser(
        username,
        name, designation, phone, null, userScopes
      );

      if (res.status == 200) {
        usernameUpdateRef.current.value = null;
        nameUpdateRef.current.value = null;
        phoneUpdateRef.current.value = null;
        designationUpdateRef.current.value = null;

        await mutate(APIURL);

        setState({
          ...state,
          selectedScopes: [],
        });

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
    <Page>
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light">Users</h3>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {users.map((user, index) => {
          const {
            username,
            name,
            role,
            photo,
            designation,
            phone,
            email,
            scope,
          } = user;

          const userScopes = scope ? new String(scope).split(",") : [];

          return (
            <div
              key={index}
              className="border border-restro-border-green-light rounded-2xl px-4 py-5 flex flex-col"
            >
              <div className="flex-1">
                <div className="flex items-center flex-col text-center gap-2">
                  <div className="flex w-24 h-24 rounded-full items-center justify-center bg-gray-100 text-gray-400">
                    <IconUser size={32} stroke={iconStroke} />
                  </div>
                  <div>
                    <p>{name}</p>
                    <p className="text-xs text-gray-500">
                      {role.toUpperCase()} 
                    </p>
                    <p className="flex gap-1 text-xs text-gray-500"><IconMail stroke={iconStroke} size={18} /> {username}</p>
                    {designation && <p className="text-xs text-white bg-restro-green rounded-full w-fit px-2 mx-auto mt-1">{designation}</p>}
                  </div>
                  
                </div>

                {phone && (
                  <p className="mt-2 text-sm flex items-center gap-1 text-gray-500">
                    <IconPhone stroke={iconStroke} size={18} /> {phone}
                  </p>
                )}
                {email && (
                  <p className="mt-2 text-sm flex flex-wrap items-center gap-1 text-gray-500 truncate ">
                    <IconMail stroke={iconStroke} size={18} /> {email}
                  </p>
                )}

                {userScopes.length > 0 && (
                  <div>
                    <p className="text-xs mt-2">Scopes:</p>
                    <div className="flex flex-wrap gap-2 w-full">
                      {userScopes.map((s, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 text-xs px-2 py-1 text-gray-400 rounded-full"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {role != "admin" && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => {
                      btnShowUpdate(username, name, phone, null, designation, scope);
                    }}
                    className="btn btn-xs text-gray-500 flex-1"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={() => {
                      btnShowChangePassword(username);
                    }}
                    className="btn btn-xs text-gray-500 flex-1"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      btnDelete(username);
                    }}
                    className="btn text-red-400 btn-xs flex-1"
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* modal add */}
      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New User</h3>

          <div className="mt-4">
            <label htmlFor="name" className="mb-1 block text-gray-500 text-sm">
              Name <span className="text-xs text-gray-400">- (Required)</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Full Name here..."
            />
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="username"
                className="mb-1 block text-gray-500 text-sm"
              >
                Email{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={usernameRef}
                type="email"
                name="username"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Email here..."
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="password"
                className="mb-1 block text-gray-500 text-sm"
              >
                Password{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={passwordRef}
                type="password"
                name="password"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Password here..."
              />
            </div>
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="phone"
                className="mb-1 block text-gray-500 text-sm"
              >
                Phone
              </label>
              <input
                ref={phoneRef}
                type="tel"
                name="phone"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Phone Number here..."
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="designation"
                className="mb-1 block text-gray-500 text-sm"
              >
                Designation
              </label>
              <input
                ref={designationRef}
                type="text"
                name="designation"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Designation here..."
              />
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            
            <div className="flex-1">
              <label
                htmlFor="scope"
                className="mb-1 text-gray-500 text-sm flex items-center gap-1"
              >
                Scope
                <div
                  className="tooltip tooltip-right"
                  data-tip="scopes are like permission"
                >
                  <IconInfoCircleFilled
                    className="text-gray-400"
                    stroke={iconStroke}
                    size={14}
                  />
                </div>
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setState({
                      ...state,
                      selectedScopes: [
                        ...new Set([...selectedScopes, e.target.value]),
                      ],
                    });
                  }
                }}
                name="scope"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Scope"
              >
                <option value="">Select Scope to add</option>
                {Object.values(SCOPES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full mt-4">
            {selectedScopes.map((s, i) => (
              <div
                key={i}
                className="bg-gray-100 text-sm p-2 text-gray-400 rounded-full flex items-center gap-1"
              >
                {s}
                <button
                  onClick={() => {
                    setState({
                      ...state,
                      selectedScopes: selectedScopes.filter(
                        (scope) => scope != s
                      ),
                    });
                  }}
                  className="text-red-400"
                >
                  <IconX stroke={iconStroke} size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="modal-action mt-4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
                Close
              </button>
              <button
                onClick={() => {
                  btnAdd();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* modal add */}

      {/* modal update */}
      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update User</h3>

          
          <div className="mt-4">
              <label
                htmlFor="username"
                className="mb-1 block text-gray-500 text-sm"
              >
                Username{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={usernameUpdateRef}
                disabled
                type="email"
                name="username"
                className=" cursor-not-allowed disabled:bg-gray-200 text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Username here..."
              />
            </div>

          <div className="flex gap-4 w-full my-4">
          <div className="flex-1">
            <label htmlFor="name" className="mb-1 block text-gray-500 text-sm">
              Name <span className="text-xs text-gray-400">- (Required)</span>
            </label>
            <input
              ref={nameUpdateRef}
              type="text"
              name="name"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Full Name here..."
            />
          </div>
            
          </div>

          <div className="flex gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="phone"
                className="mb-1 block text-gray-500 text-sm"
              >
                Phone
              </label>
              <input
                ref={phoneUpdateRef}
                type="tel"
                name="phone"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Phone Number here..."
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="designation"
                className="mb-1 block text-gray-500 text-sm"
              >
                Designation
              </label>
              <input
                ref={designationUpdateRef}
                type="text"
                name="designation"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Designation here..."
              />
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            
            <div className="flex-1">
              <label
                htmlFor="scope"
                className="mb-1 text-gray-500 text-sm flex items-center gap-1"
              >
                Scope
                <div
                  className="tooltip tooltip-right"
                  data-tip="scopes are like permission"
                >
                  <IconInfoCircleFilled
                    className="text-gray-400"
                    stroke={iconStroke}
                    size={14}
                  />
                </div>
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setState({
                      ...state,
                      selectedScopes: [
                        ...new Set([...selectedScopes, e.target.value]),
                      ],
                    });
                  }
                }}
                name="scope"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Scope"
              >
                <option value="">Select Scope to add</option>
                {Object.values(SCOPES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full mt-4">
            {selectedScopes.map((s, i) => (
              <div
                key={i}
                className="bg-gray-100 text-sm p-2 text-gray-400 rounded-full flex items-center gap-1"
              >
                {s}
                <button
                  onClick={() => {
                    setState({
                      ...state,
                      selectedScopes: selectedScopes.filter(
                        (scope) => scope != s
                      ),
                    });
                  }}
                  className="text-red-400"
                >
                  <IconX stroke={iconStroke} size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="modal-action mt-4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
                Close
              </button>
              <button
                onClick={() => {
                  btnUpdate();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* modal update */}

      {/* modal reset password */}
      <dialog id="modal-reset-password" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reset Password</h3>

          <div className="flex flex-col gap-4 w-full my-4">
            <div className="flex-1">
              <label
                htmlFor="username"
                className="mb-1 block text-gray-500 text-sm"
              >
                Username
              </label>
              <input
                ref={changePasswordModalUsernameRef}
                disabled
                type="text"
                name="username"
                className="cursor-not-allowed disabled:bg-gray-200 text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Username here..."
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="password"
                className="mb-1 block text-gray-500 text-sm"
              >
                Password{" "}
                <span className="text-xs text-gray-400">- (Required)</span>
              </label>
              <input
                ref={changePasswordModalNewPasswordRef}
                type="password"
                name="password"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Password here..."
              />
            </div>
          </div>


          <div className="modal-action mt-4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
                Close
              </button>
              <button
                onClick={() => {
                  btnChangePassword();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* modal change password */}
    </Page>
  );
}
