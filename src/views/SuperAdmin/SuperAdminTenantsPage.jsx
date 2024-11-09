import React, { useState, useEffect, useRef } from "react";
import Page from "../../components/Page";
import {
  IconSearch,
  IconFilter,
  IconBuildingStore,
  IconCheck,
  IconX,
  IconPencil,
  IconCalendarEvent,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconAlertTriangleFilled,
} from "@tabler/icons-react";
import { iconStroke, subscriptionPrice } from "../../config/config";
import {
  useSuperAdminTenantsData,
  getTenantsData,
  addTenant,
  updateTenant,
  deleteTenant,
  getTenantsDataByStatus,
  getSuperAdminTenantsData,
} from "../../controllers/superadmin.controller";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";
import { validateEmail } from "../../utils/emailValidator";
import { mutate } from "swr";
import useDebounce from "../../utils/useDebounce";
import { Link } from "react-router-dom";

export default function SuperAdminTenantsPage() {
  const filters = [
    { key: "today", value: "Today" },
    { key: "tomorrow", value: "Tomorrow" },
    { key: "yesterday", value: "Yesterday" },
    { key: "last_7days", value: "Last 7 Days" },
    { key: "this_month", value: "This Month" },
    { key: "last_month", value: "Last Month" },
    { key: "custom", value: "Custom" },
  ];

  const filterTypeRef = useRef();
  const fromDateRef = useRef();
  const toDateRef = useRef();

  // For Add tenant
  const nameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const isActiveRef = useRef();

  // For update
  const [tenantIdForUpdate, setTenantIdForUpdate] = useState(null);

  const updatenameRef = useRef();
  const updateusernameRef = useRef();
  const updateisActiveRef = useRef();

  // For Delete
  const [tenantIdForDelete, setTenantIdForDelete] = useState(null);

  const now = new Date();
  const defaultDateFrom = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const defaultDateTo = `${now.getFullYear()}-${(now.getMonth() + 2)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  const [state, setState] = useState({
    status: "active",
    tenants: [],
    search: "",
    page: 1,
    perPage: 5,
    totalPages: 1,
    totalTenants: 0,
    activeTenants: 0,
    inactiveTenants: 0,
    allTenants: 0,
    filter: null,
    fromDate: null,
    toDate: null,
  });

  // const {
  //   data: superAdminTenantsData,
  //   error: superAdminTenantsError,
  //   isLoading: superAdminTenantsLoading,
  //   APIURL,
  // } = useSuperAdminTenantsData(); //FIXME: convert to regular api call instead of swr

  const fetchData = async () => {
    try {
      const superAdminTenantsData = await getSuperAdminTenantsData();
      const { activeTenants, inactiveTenants, allTenants } =
        superAdminTenantsData.data;

      const { data } = await getTenantsData({
        page: state.page,
        perPage: state.perPage,
        search: state.search,
        status: state.status,
        type: state.filter,
        from: state.fromDate,
        to: state.toDate,
      });
  
      if (data) {
        const { tenants, currentPage, perPage } = data;
  
        // Destructure current state values
        const { status } = state;
  
        // Determine the total number of tenants and total pages based on status
        let totalTenants;
        let totalPages;
  
        switch (status) {
          case "active":
            totalTenants = activeTenants;
            totalPages = Math.ceil(activeTenants / perPage);
            break;
          case "inactive":
            totalTenants = inactiveTenants;
            totalPages = Math.ceil(inactiveTenants / perPage);
            break;
          default:
            totalTenants = allTenants;
            totalPages = Math.ceil(allTenants / perPage);
        }
  
        // Update state
        setState((prevState) => ({
          ...prevState,
          tenants,
          page: currentPage,
          perPage,
          totalPages,
          totalTenants,
          activeTenants,
          inactiveTenants,
          allTenants,
        }));
      }
    } catch (error) {
      console.error("Error fetching tenants data:", error);
      toast.dismiss();
      toast.error("Error loading Tenants Data! Please try later!");
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    state.status,
    state.perPage,
    state.page,
    state.filter,
    state.fromDate,
    state.toDate,
    state.activeTenants, // Added dependency
    state.inactiveTenants, // Added dependency
    state.allTenants, // Added dependency
  ]);

  const handleTabChange = (newStatus) => {
    setState((prevState) => ({
      ...prevState,
      status: newStatus,
      page: 1,
    }));
  };

  useDebounce(
    () => {
      fetchData();
    },
    [state.search],
    800
  );

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setState((prevState) => ({
      ...prevState,
      search: searchTerm,
      page: 1,
    }));
  };

  const btnPaginationFirstPage = () => {
    setState({
      ...state,
      page: 1,
    });
  };
  const btnPaginationLastPage = () => {
    const totalPages =
      state.status === "active"
        ? Math.ceil(state.activeTenants / state.perPage)
        : state.status === "inactive"
        ? Math.ceil(state.inactiveTenants / state.perPage)
        : Math.ceil(state.allTenants / state.perPage);

    setState((prevState) => ({
      ...prevState,
      page: totalPages,
    }));
  };

  const btnPaginationNextPage = () => {
    const totalPages =
      state.status === "active"
        ? Math.ceil(state.activeTenants / state.perPage)
        : state.status === "inactive"
        ? Math.ceil(state.inactiveTenants / state.perPage)
        : Math.ceil(state.allTenants / state.perPage);

    if (state.page < totalPages) {
      setState((prevState) => ({
        ...prevState,
        page: prevState.page + 1,
      }));
    }
  };

  const btnPaginationPreviousPage = () => {
    if (state.page > 1) {
      setState((prevState) => ({
        ...prevState,
        page: prevState.page - 1,
      }));
    }
  };

  const handleExportCSV = async () => {
    try {
      const { Parser } = await import("@json2csv/plainjs");
      const { saveAs } = await import("file-saver");

      const opts = {};
      const parser = new Parser(opts);

      const currStatus = state.status != "" ? state.status : "all";
      const res = await getTenantsDataByStatus(currStatus);

      if (res.status == 200) {
        const data = res.data.map((tenant) => ({
          Name: tenant.name || "",
          Email: tenant.email || "",
          Status: tenant.is_active ? "Active" : "Inactive",
          Subscription_Start_Date: tenant.subscription_start || "",
          Subscription_End_Date: tenant.subscription_end || "",
          Plan: subscriptionPrice,
        }));

        const csv = parser.parse(data);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const formattedStatus =
          state.status != ""
            ? `${state.status.charAt(0).toUpperCase() + state.status.slice(1)}`
            : "All";
        const formattedDate = `${new Date().toISOString().substring(0, 10)}`;
        const fileName = `${formattedStatus} Tenants Data - ${formattedDate}.csv`;

        saveAs(blob, fileName);

        toast.dismiss();
        toast.success("Data exported successfully !");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.dismiss();
      toast.error("Failed to export Data. Please try again.");
    }
  };

  const btnAdd = async () => {
    const name = nameRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const isActive = isActiveRef.current.checked;

    if (!name) {
      toast.error("Please provide name!");
      return;
    }
    if (!username) {
      toast.error("Please provide Email!");
      return;
    }
    if (!password) {
      toast.error("Please provide password!");
      return;
    }

    if (!validateEmail(username)) {
      toast.error("Please provide valid email!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addTenant(name, username, password, isActive);

      if (res.status == 200) {
        nameRef.current.value = null;
        usernameRef.current.value = null;
        passwordRef.current.value = null;
        isActiveRef.current.checked = false;

        // await mutate(APIURL);
        await fetchData();

        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error ", error);
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  const btnShowUpdate = (name, email, isActive, tenantId) => {
    updatenameRef.current.value = name || "";
    updateusernameRef.current.value = email || "";
    updateisActiveRef.current.checked = isActive || 0;

    setTenantIdForUpdate(tenantId);

    document.getElementById("modal-update-tenant").showModal();
  };

  async function btnUpdate() {
    const name = updatenameRef.current.value;
    const email = updateusernameRef.current.value;
    const isActive = updateisActiveRef.current.checked || 0;

    if (!name) {
      toast.error("Please Provide Tenant's Name!");
      return;
    }

    if (!email) {
      toast.error("Please Provide Tenant's Email!");
      return;
    }

    if (email) {
      if (!validateEmail(email)) {
        toast.error("Please Provide Valid Email!");
        return;
      }
    }

    try {
      toast.loading("Please wait...");
      const res = await updateTenant(name, email, isActive, tenantIdForUpdate);

      if (res.status == 200) {
        updatenameRef.current.value = null;
        updateusernameRef.current.value = null;
        updateisActiveRef.current.checked = 0;

        // await mutate(APIURL);

        await fetchData();

        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  }

  const btnShowDelete = (tenantId) => {
    setTenantIdForDelete(tenantId);
    document.getElementById("modal-delete-tenant").showModal();
  };

  const btnDelete = async (tenantId) => {
    try {
      toast.loading("Please wait...");
      const res = await deleteTenant(tenantId);

      if (res.status == 200) {
        // await mutate(APIURL);
        await fetchData();
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <Page className="px-4 py-3 overflow-x-hidden h-full">
      <div className="flex gap-6 items-center mb-6 mt-6">
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="bg-restro-green text-white text-sm px-6 py-2 rounded-[42px] hover:bg-restro-green/80"
        >
          Add Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <button
          className={clsx(
            'flex flex-col p-6 gap-1 rounded-3xl border border-restro-border-green-light bg-[url(/assets/wave-bg.svg)] bg-cover bg-right cursor-pointer',
            {
              'border-2 border-restro-green/90': state.status === 'active',
            }
          )}
          onClick={() => handleTabChange("active")}
        >
          <span className="text-base lg:text-lg font-bold text-gray-500">
            Active
          </span>
          <span className="text-4xl lg:text-5xl font-black text-restro-green">
            {state.activeTenants}
          </span>
        </button>

        <button
          className={`flex flex-col p-6 gap-1 rounded-3xl border border-restro-border-green-light cursor-pointer ${
            state.status === "inactive" ? "border-2 border-restro-green/90" : ""
          }`}
          onClick={() => handleTabChange("inactive")}
        >
          <span className="text-base lg:text-lg font-medium text-gray-500">
            Inactive
          </span>
          <span className="text-4xl lg:text-5xl font-black text-gray-800">
            {state.inactiveTenants}
          </span>
        </button>

        <button
          className={`flex flex-col p-6 gap-1 rounded-3xl border border-restro-border-green-light cursor-pointer ${
            state.status === "" ? "border-2 border-restro-green/90" : ""
          }`}
          onClick={() => handleTabChange("")}
        >
          <span className="text-base lg:text-lg font-medium text-gray-500">
            All
          </span>
          <span className="text-4xl lg:text-5xl font-black text-gray-800">
            {state.allTenants}
          </span>
        </button>
      </div>

      <div className="flex flex-col px-6 py-6 border border-restro-border-green-light rounded-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="flex items-center bg-white/40 backdrop-blur sticky top-0 z-10 rounded-t-2xl w-full sm:w-auto gap-2">
            <label className="flex-grow bg-gray-100 rounded-[42px] px-3 py-2 text-gray-500 flex items-center gap-2 w-full">
              <IconSearch size={16} stroke={iconStroke} />
              <input
                type="search"
                placeholder="Search"
                value={state.search}
                onChange={handleSearchChange}
                className="w-full bg-transparent outline-none text-sm"
              />
            </label>
            <button
              onClick={() =>
                document.getElementById("filter-dialog").showModal()
              }
              className="btn btn-circle btn-sm"
            >
              <IconFilter size={16} stroke={iconStroke} />
            </button>
          </div>
          <button
            onClick={handleExportCSV}
            className="mt-2 sm:mt-0 bg-restro-green text-white text-sm px-4 sm:px-6 py-2 rounded-[42px] hover:bg-restro-green/80 whitespace-nowrap w-full sm:w-auto"
          >
            {state.status !== ""
              ? `Export ${
                  state.status.charAt(0).toUpperCase() + state.status.slice(1)
                } Tenants`
              : "Export All Tenants"}
          </button>
        </div>

        {state.tenants.length === 0 ? (
          <div className="text-center w-full h-[50vh] flex flex-col items-center justify-center text-gray-500">
            <p>No Tenants Found!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-y-1">
              <thead className="bg-transparent">
                <tr>
                  <th className="rounded-[42px] px-3 flex items-center justify-between">
                    <div className="text-start px-0 py-1 w-1/4 min-w-[250] max-w-[300px]   text-sm sm:text-xs md:text-sm lg:text-base">
                      Tenant Details
                    </div>
                    <div className="px-2 py-1 w-1/6 min-w-[80] max-w-[120px]   text-sm sm:text-xs md:text-sm lg:text-base">
                      Status
                    </div>
                    <div className="px-2 py-1 w-1/6 min-w-[150] max-w-[200px]   text-sm sm:text-xs md:text-sm lg:text-base">
                      Subscription Start
                    </div>
                    <div className="px-2 py-1 w-1/6 min-w-[150] max-w-[200px]   text-sm sm:text-xs md:text-sm lg:text-base">
                      Subscription End
                    </div>
                    <div className="px-2 py-1 w-1/6 min-w-[80] max-w-[120px]   text-sm sm:text-xs md:text-sm lg:text-base">
                      Plan
                    </div>
                    <div className="px-2 py-1 w-1/5 min-w-[80] max-w-[200px]   text-sm sm:text-xs md:text-sm lg:text-base mr-8">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.tenants.map((tenant, index) => (
                  <tr key={index}>
                    <td className="py-1">
                      <div className="bg-gray-100 rounded-[42px] px-3 flex items-center justify-between">
                        <div className="flex items-center py-2 w-1/4 min-w-[250px] max-w-[300px] ">
                          <div className="bg-gray-200 rounded-[42px] p-6 mr-4 bg-white/90">
                            <IconBuildingStore size={18} stroke={iconStroke} />
                          </div>
                          <div>
                            <div className="font-bold text-sm ">
                              {tenant.name}
                            </div>
                            <div className="text-xs font-semibold text-gray-500">
                              {tenant.email}
                            </div>
                          </div>
                        </div>
                        <div className="w-1/4 min-w-[80px] max-w-[120px]  flex items-center justify-center">
                          <span
                            className={`px-4 py-2 text-sm rounded-[42px] bg-white flex items-center gap-2 ${
                              tenant.is_active == 1
                                ? "text-green-600"
                                : "text-red-700"
                            }`}
                          >
                            {tenant.is_active == 1 ? (
                              <>
                                <IconCheck size={16} stroke={iconStroke} />
                                Active
                              </>
                            ) : (
                              <>
                                <IconX size={16} stroke={iconStroke} />
                                Inactive
                              </>
                            )}
                          </span>
                        </div>
                        <div className="w-1/4 min-w-[150px] max-w-[200px]  text-center text-sm font-bold">
                          {tenant.subscription_start}
                        </div>
                        <div className="w-1/4 min-w-[150px] max-w-[200px]   text-center text-sm font-bold">
                          {tenant.subscription_end}
                        </div>
                        <div className="w-1/4 min-w-[80px] max-w-[120px]   text-center text-sm font-bold">
                          {subscriptionPrice}/month
                        </div>
                        <div className="w-1/5 min-w-[150px] max-w-[200px]  text-right mr-8">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                btnShowUpdate(
                                  tenant.name,
                                  tenant.email,
                                  tenant.is_active,
                                  tenant.id
                                );
                              }}
                              className="rounded-[42px] bg-white p-3 text-gray-500"
                            >
                              <IconPencil size={24} stroke={iconStroke} />
                            </button>
                            <Link
                              to={`/superadmin/dashboard/tenants/${tenant.id}/subscription-history`}
                              className="rounded-[42px] bg-white p-3 flex items-center justify-center text-gray-500"
                            >
                              <IconCalendarEvent
                                size={24}
                                stroke={iconStroke}
                              />
                            </Link>
                            <button
                              onClick={() => btnShowDelete(tenant.id)}
                              className="rounded-[42px] bg-white p-3 text-red-500"
                            >
                              <IconTrash size={24} stroke={iconStroke} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* pagination */}
        <div className="flex justify-end mt-8">
          <div className="join">
            <button
              onClick={btnPaginationFirstPage}
              className={clsx(
                "join-item btn btn-sm bg-gray-100 text-gray-500",
                {
                  "btn-disabled": state.page == 1,
                }
              )}
            >
              <IconChevronsLeft stroke={iconStroke} />
            </button>
            <button
              onClick={btnPaginationPreviousPage}
              className={clsx(
                "join-item btn btn-sm bg-gray-100 text-gray-500",
                {
                  "btn-disabled": state.page == 1,
                }
              )}
            >
              <IconChevronLeft stroke={iconStroke} />
            </button>
            <button className="join-item btn btn-sm bg-gray-100 text-gray-500">
              Page {state.page}
            </button>
            <button
              onClick={btnPaginationNextPage}
              className={clsx(
                "join-item btn btn-sm bg-gray-100 text-gray-500",
                {
                  "btn-disabled": state.page == state.totalPages,
                }
              )}
            >
              <IconChevronRight stroke={iconStroke} />
            </button>
            <button
              onClick={btnPaginationLastPage}
              className={clsx(
                "join-item btn btn-sm bg-gray-100 text-gray-500",
                {
                  "btn-disabled": state.page == state.totalPages,
                }
              )}
            >
              <IconChevronsRight stroke={iconStroke} />
            </button>
          </div>
        </div>
        <div className="text-end mt-4">
          <p>
            Showing {state.tenants.length} of {state.totalTenants}
          </p>
        </div>
        {/* pagination */}
      </div>

      {/* filter dialog */}
      <dialog id="filter-dialog" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center">
            <IconFilter stroke={iconStroke} /> Filter
          </h3>
          {/* filters */}
          <div className="my-4">
            <div>
              <label className=" block text-gray-500 text-sm">Filter</label>
              <select
                className="select select-sm select-bordered w-full"
                ref={filterTypeRef}
              >
                {filters.map((filter, index) => (
                  <option key={index} value={filter.key}>
                    {filter.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <label
                  htmlFor="fromDate"
                  className=" block text-gray-500 text-sm"
                >
                  From
                </label>
                <input
                  defaultValue={defaultDateFrom}
                  type="date"
                  ref={fromDateRef}
                  className="text-sm w-full border rounded-lg px-4 py-1 bg-gray-50 outline-restro-border-green-light"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="toDate"
                  className=" block text-gray-500 text-sm"
                >
                  To
                </label>
                <input
                  defaultValue={defaultDateTo}
                  type="date"
                  ref={toDateRef}
                  className="text-sm w-full border rounded-lg px-4 py-1 bg-gray-50 outline-restro-border-green-light"
                />
              </div>
            </div>
          </div>
          {/* filters */}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button
                onClick={() => {
                  setState({
                    ...state,
                    filter: filterTypeRef.current.value,
                    fromDate: fromDateRef.current.value || null,
                    toDate: toDateRef.current.value || null,
                  });
                }}
                className="btn ml-2"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* filter dialog */}

      {/* modal add */}
      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Tenant</h3>

          <div className="mt-4">
            <label htmlFor="name" className="mb-1 block text-gray-500 text-sm">
              Tenant Name{" "}
              <span className="text-xs text-gray-400">- (Required)</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Tenant Name here..."
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

          <div className="flex items-center mt-6 ml-1 gap-2">
            <label className="text-gray-500 text-sm mr-2">Active</label>
            <label className="relative inline-flex items-center cursor-pointer no-drag">
              <input
                ref={isActiveRef}
                type="checkbox"
                name="isActive"
                id="isActive"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
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

      {/* update dialog */}
      <dialog
        id="modal-update-tenant"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Tenant</h3>

          <div className="mt-4">
            <label htmlFor="name" className="mb-1 block text-gray-500 text-sm">
              Tenant Name{" "}
              <span className="text-xs text-gray-400">- (Required)</span>
            </label>
            <input
              ref={updatenameRef}
              type="text"
              name="name"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Tenant's Name"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="email" className="mb-1 block text-gray-500 text-sm">
              Email
            </label>
            <input
              ref={updateusernameRef}
              type="email"
              name="email"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Tenant's Email"
            />
          </div>

          <div className="flex items-center mt-6 ml-1 gap-2">
            <label className="text-gray-500 text-sm mr-2">Active</label>
            <label className="relative inline-flex items-center cursor-pointer no-drag">
              <input
                ref={updateisActiveRef}
                type="checkbox"
                name="isActive"
                id="isActive"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
          </div>

          <div className="modal-action">
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
      {/* update dialog */}

      {/* Delete Confirmation Modal with Red Overlay */}
      <dialog
        id="modal-delete-tenant"
        className="modal fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-red-600 opacity-30"></div>

        {/* Modal Box */}
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto z-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Are you sure ?</h2>
            <p className="text-gray-500 font-bold">
              This action is irreversible
            </p>
          </div>

          <div className="mt-4 text-center">
            <div className="mt-2 p-4 bg-red-100 rounded-lg text-left">
              <div className="flex items-center">
                <IconAlertTriangleFilled
                  className="text-red-600 mr-2"
                  size={24}
                />
                <p className="text-red-700 font-bold text-lg">Warning</p>
              </div>
              <p className="text-red-700 mt-1 text-sm">
                All accounts associated with this tenant will be{" "}
                <b>permanently deleted</b>
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() =>
                document.getElementById("modal-delete-tenant").close()
              }
              className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-6 py-3 bg-gray-200 text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                document.getElementById("modal-delete-tenant").close();
                btnDelete(tenantIdForDelete);
              }}
              className="rounded-lg hover:bg-red-500 transition active:scale-95 hover:shadow-lg px-6 py-3 bg-red-700 text-white"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </dialog>
    </Page>
  );
}
