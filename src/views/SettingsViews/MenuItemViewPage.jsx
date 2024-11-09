import React, { useRef } from "react";
import Page from "../../components/Page";
import { Link, useParams } from "react-router-dom";
import { addMenuItemAddon, addMenuItemVariant, deleteMenuItemAddon, deleteMenuItemVariant, removeMenuItemPhoto, updateMenuItem, updateMenuItemAddon, updateMenuItemVariant, uploadMenuItemPhoto, useMenuItem } from "../../controllers/menu_item.controller";
import { useCategories, useTaxes } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { IconCarrot, IconChevronDown, IconPencil, IconTrash, IconUpload } from "@tabler/icons-react";
import { iconStroke } from "../../config/config"
import imageCompression from "browser-image-compression";
import { getImageURL } from "../../helpers/ImageHelper";

export default function MenuItemViewPage() {
  const params = useParams();
  const itemId = params.id;

  const titleRef = useRef();
  const priceRef = useRef();
  const netPriceRef = useRef();
  const taxIdRef = useRef();
  const categoryIdRef = useRef();

  const variantTitleRef = useRef();
  const variantPriceRef = useRef();

  const variantIdRef = useRef();
  const variantTitleUpdateRef = useRef();
  const variantPriceUpdateRef = useRef();

  const addonTitleRef = useRef();
  const addonPriceRef = useRef();

  const addonIdRef = useRef();
  const addonTitleUpdateRef = useRef();
  const addonPriceUpdateRef = useRef();

  const {
    APIURL: APIURLCategories,
    data: categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useCategories();

  const {
    APIURL: APIURLTaxes,
    data: taxes,
    error: errorTaxes,
    isLoading: isLoadingTaxes,
  } = useTaxes();

  const { APIURL, data: menuItem, error, isLoading } = useMenuItem(itemId);

  if (isLoadingCategories) {
    return <Page>Please wait...</Page>;
  }

  if (errorCategories) {
    return <Page>Error loading details! Please Try Later!</Page>;
  }

  if (isLoadingTaxes) {
    return <Page>Please wait...</Page>;
  }

  if (errorTaxes) {
    return <Page>Error loading details! Please Try Later!</Page>;
  }

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    return <Page>Error loading details! Please Try Later!</Page>;
  }

  const {
    id,
    title,
    category_id,
    category_title,
    tax_id,
    tax_title,
    tax_rate,
    tax_type,
    price,
    net_price,
    addons,
    variants,
    image
  } = menuItem;
  const imageURL = image ? getImageURL(image) : null;


  async function btnSave() {
    const title = titleRef.current.value;
    const price = priceRef.current.value;
    const netPrice = netPriceRef.current.value || null;
    const categoryId = categoryIdRef.current.value || null;
    const taxId = taxIdRef.current.value || null;

    if(!title) {
      toast.error("Please enter title!");
      return;
    }

    if(price < 0) {
      toast.error("Please provide valid price!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateMenuItem(id, title, price, netPrice, categoryId, taxId);

      if(res.status == 200) {
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error.response.data.message || "Something went wrong!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  }

  const btnVariantDelete = async (variantId) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteMenuItemVariant(id, variantId);

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

  const btnAddonDelete = async (addonId) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteMenuItemAddon(id, addonId);

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

  async function btnAddVariant() {
    const variantTitle = variantTitleRef.current.value;
    const variantPrice = variantPriceRef.current.value || 0;

    if(!variantTitle) {
      toast.error("Please provide variant title!");
      return;
    }
    if(variantPrice < 0) {
      toast.error("Please provide valid variant price!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addMenuItemVariant(id, variantTitle, variantPrice);

      if(res.status == 200) {
        variantTitleRef.current.value = null;
        variantPriceRef.current.value = null;

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
  }

  const btnShowVariantUpdate = (variantId, title, price) => {
    variantIdRef.current.value = variantId;
    variantTitleUpdateRef.current.value = title;
    variantPriceUpdateRef.current.value = price;
    document.getElementById('modal-update-variant').showModal()
  };

  async function btnUpdateVariant() {
    const variantId = variantIdRef.current.value;
    const variantTitle = variantTitleUpdateRef.current.value;
    const variantPrice = variantPriceUpdateRef.current.value || 0;

    if(!variantTitle) {
      toast.error("Please provide variant title!");
      return;
    }
    if(variantPrice < 0) {
      toast.error("Please provide valid variant price!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateMenuItemVariant(id, variantId, variantTitle, variantPrice);

      if(res.status == 200) {
        variantIdRef.current.value = null;
        variantTitleUpdateRef.current.value = null;
        variantPriceUpdateRef.current.value = null;

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
  }

  async function btnAddAddon() {
    const addonTitle = addonTitleRef.current.value;
    const addonPrice = addonPriceRef.current.value || 0;

    if(!addonTitle) {
      toast.error("Please provide addon title!");
      return;
    }
    if(addonPrice < 0) {
      toast.error("Please provide valid addon price!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addMenuItemAddon(id, addonTitle, addonPrice);

      if(res.status == 200) {
        addonTitleRef.current.value = null;
        addonPriceRef.current.value = null;

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
  }

  const btnShowAddonUpdate = (addonId, title, price) => {
    addonIdRef.current.value = addonId;
    addonTitleUpdateRef.current.value = title;
    addonPriceUpdateRef.current.value = price;
    document.getElementById('modal-update-addon').showModal()
  };

  async function btnUpdateAddon() {
    const addonId = addonIdRef.current.value;
    const addonTitle = addonTitleUpdateRef.current.value;
    const addonPrice = addonPriceUpdateRef.current.value || 0;

    if(!addonTitle) {
      toast.error("Please provide addon title!");
      return;
    }
    if(addonPrice < 0) {
      toast.error("Please provide valid addon price!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateMenuItemAddon(id, addonId, addonTitle, addonPrice);

      if(res.status == 200) {
        addonIdRef.current.value = null;
        addonTitleUpdateRef.current.value = null;
        addonPriceUpdateRef.current.value = null;

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
  }

  const handleFileChange = async (e) => {
    
    const file = e.target.files[0];

    if(!file) {
      return;
    }

    // compress image
    try {
      toast.loading("Please wait...");
      const compressedImage = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      })

      const formData = new FormData();
      formData.append("image", compressedImage);

      const res = await uploadMenuItemPhoto(itemId, formData);
      if(res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);

        // update the image state
        const imagePath = res.data.imageURL;
        await mutate(APIURL);
        location.reload();
      }

    } catch (error) {
      console.error(error);
      toast.dismiss();
      const message = error?.response?.data?.message || "We're getting issue while processing your request, Please try later!";
      toast.error(message)
    }
  }

  const btnRemoveMenuItemImage = async () => {
    const isConfirm = window.confirm("Are you sure! This operation is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      
      const res = await removeMenuItemPhoto(itemId);
      if(res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);
        await mutate(APIURL);
        location.reload();
      }

    } catch (error) {
      console.error(error);
      toast.dismiss();
      const message = error?.response?.data?.message || "We're getting issue while processing your request, Please try later!";
      toast.error(message)
    }
  }

  return (
    <Page className="px-4 md:px-8 py-3 md:py-6">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to="/dashboard/settings">Settings</Link>
          </li>
          <li>
            <Link to="/dashboard/settings/menu-items">Menu Items</Link>
          </li>
          <li>{title}</li>
        </ul>
      </div>

      <div className="my-6 flex gap-6 flex-col lg:flex-row">
        <div className="">
          <div className="relative w-32 h-32 md:w-64 md:h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-600 text-2xl mb-4">

            {
              image ? <div className="w-full h-full relative top-0 left-0">
                <img src={imageURL} alt={title} className="w-full h-full absolute top-0 left-0 rounded-2xl object-cover" /> 
              </div>:
              <p className="absolute"><IconCarrot stroke={iconStroke} /></p>
            }
            

            {/* upload image options */}
            <div className="absolute bottom-2 md:bottom-auto md:top-4 md:right-4 flex items-center gap-2">
              <label htmlFor="file" className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-slate-100 cursor-pointer transition active:scale-95">
                <IconUpload stroke={iconStroke} size={18} />
                <input onChange={handleFileChange} type="file" name="file" id="file" className="hidden" accept="image/*" />
              </label>

              <button onClick={btnRemoveMenuItemImage} className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-slate-100 cursor-pointer transition active:scale-95 text-red-500">
                <IconTrash stroke={iconStroke} size={18} />
              </button>
            </div>
            {/* upload image options */}
          </div>
          <p>Price: {price}</p>
          {net_price && (
            <p className="text-sm text-gray-500">Net Price: {net_price}</p>
          )}
          {category_id && (
            <p className="text-sm text-gray-500">Category: {category_title}</p>
          )}
          {tax_id && (
            <p className="text-sm text-gray-500">
              Tax: {tax_title} - {tax_rate}% ({tax_type})
            </p>
          )}

          <button onClick={btnSave} className="mt-6 text-white w-full bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-2 outline-restro-border-green-light">Save</button>
        </div>
        <div className="flex-1">
          <div className="">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">
              Title
            </label>
            <input
              ref={titleRef}
              defaultValue={title}
              type="text"
              name="title"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Item Title"
            />
          </div>

          <div className="flex gap-4 w-full my-4 flex-col lg:flex-row">
            <div className="flex-1">
              <label
                htmlFor="price"
                className="mb-1 block text-gray-500 text-sm"
              >
                Price
              </label>
              <input
                ref={priceRef}
                defaultValue={price}
                type="number"
                name="price"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Item Price"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="nprice"
                className="mb-1 block text-gray-500 text-sm"
              >
                Net Price
              </label>
              <input
                ref={netPriceRef}
                type="number"
                name="nprice"
                defaultValue={net_price}
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Enter Item Net Price"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full my-4 flex-col lg:flex-row">
            <div className="flex-1">
              <label
                htmlFor="category"
                className="mb-1 block text-gray-500 text-sm"
              >
                Category
              </label>
              <select
                ref={categoryIdRef}
                defaultValue={category_id}
                name="category"
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Category"
              >
                <option value="">None</option>
                {categories.map((category, index) => {
                  return (
                    <option value={category.id} key={category.id}>
                      {category.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="tax" className="mb-1 block text-gray-500 text-sm">
                Tax
              </label>
              <select
                ref={taxIdRef}
                name="tax"
                defaultValue={tax_id}
                className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                placeholder="Select Tax"
              >
                <option value="">None</option>
                {taxes.map((tax, index) => {
                  return (
                    <option value={tax.id} key={tax.id}>
                      {tax.title} - {tax.rate}% ({tax.type})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* variants */}
          <div className="collapse bg-gray-50 collapse-arrow mt-6">
            <input type="checkbox" /> 
            <div className="collapse-title font-medium">
              Show Variants
            </div>
            <div className="collapse-content flex flex-col"> 
              {
                variants.map((variant, index)=>{
                  return <div key={variant.id} className="flex items-center justify-between hover:bg-gray-100 transition p-2 rounded-lg cursor-pointer">
                    <div className="flex-1">
                      <p>{variant.title}</p>
                      <p className="text-xs text-gray-500">Price: {variant.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          btnShowVariantUpdate(variant.id, variant.title, variant.price);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition active:scale-95"
                      >
                        <IconPencil stroke={iconStroke} />
                      </button>
                      <button
                        onClick={() => {
                          btnVariantDelete(variant.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-200 transition active:scale-95"
                      >
                        <IconTrash stroke={iconStroke} />
                      </button>
                    </div>
                  </div>
                })
              }

              <button onClick={()=>document.getElementById('modal-add-variant').showModal()} className="btn btn-sm mt-4">Add Variant</button>
            </div>
          </div>
          {/* variants */}

          {/* addons */}
          <div className="collapse bg-gray-50 collapse-arrow mt-4">
            <input type="checkbox" /> 
            <div className="collapse-title font-medium">
              Show Addons
            </div>
            <div className="collapse-content flex flex-col"> 
              {
                addons.map((addon, index)=>{
                  return <div key={addon.id} className="flex items-center justify-between hover:bg-gray-100 transition p-2 rounded-lg cursor-pointer">
                    <div className="flex-1">
                      <p>{addon.title}</p>
                      <p className="text-xs text-gray-500">Price Increase: +{addon.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          btnShowAddonUpdate(addon.id, addon.title, addon.price);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition active:scale-95"
                      >
                        <IconPencil stroke={iconStroke} />
                      </button>
                      <button
                        onClick={() => {
                          btnAddonDelete(addon.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-200 transition active:scale-95"
                      >
                        <IconTrash stroke={iconStroke} />
                      </button>
                    </div>
                  </div>
                })
              }
              <button onClick={()=>document.getElementById('modal-add-addon').showModal()} className="btn btn-sm mt-4">Add Addon</button>
            </div>
          </div>
          {/* addons */}

        </div>
      </div>

      {/* variant add dialog */}
      <dialog id="modal-add-variant" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Variant</h3>
          
          <div className="mt-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Variant Title</label>
            <input ref={variantTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Variant Title" />
          </div>

          <div className="my-4">
            <label htmlFor="price" className="mb-1 block text-gray-500 text-sm">Variant Price</label>
            <input ref={variantPriceRef} type="number" name="price" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Variant Price" />

            <p className="text-xs text-gray-500 mt-1">*Entered price = Final price, overrides base price.</p>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnAddVariant();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* variant add dialog */}

      {/* variant update dialog */}
      <dialog id="modal-update-variant" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Variant</h3>
          
          <div className="mt-4">
            <input type="hidden" ref={variantIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Variant Title</label>
            <input ref={variantTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Variant Title" />
          </div>

          <div className="my-4">
            <label htmlFor="price" className="mb-1 block text-gray-500 text-sm">Variant Price</label>
            <input ref={variantPriceUpdateRef} type="number" name="price" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Variant Price" />

            <p className="text-xs text-gray-500 mt-1">*Entered price = Final price, overrides base price.</p>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnUpdateVariant();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* variant update dialog */}

      {/* addon add dialog */}
      <dialog id="modal-add-addon" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Addon</h3>
          
          <div className="mt-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Addon Title</label>
            <input ref={addonTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Addon Title" />
          </div>

          <div className="my-4">
            <label htmlFor="price" className="mb-1 block text-gray-500 text-sm">Addon Price</label>
            <input ref={addonPriceRef} type="number" name="price" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Addon Price" />

            <p className="text-xs text-gray-500 mt-1">*Final price of Item = Base Price + Entered Price, adds to base price in POS.</p>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnAddAddon();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* addon add dialog */}

      {/* addon update dialog */}
      <dialog id="modal-update-addon" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Addon</h3>
          
          <div className="mt-4">
            <input type="hidden" ref={addonIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Addon Title</label>
            <input ref={addonTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Addon Title" />
          </div>

          <div className="my-4">
            <label htmlFor="price" className="mb-1 block text-gray-500 text-sm">Addon Price</label>
            <input ref={addonPriceUpdateRef} type="number" name="price" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Addon Price" />

            <p className="text-xs text-gray-500 mt-1">*Final price of Item = Base Price + Entered Price, adds to base price in POS.</p>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnUpdateAddon();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* addon update dialog */}
    </Page>
  );
}
