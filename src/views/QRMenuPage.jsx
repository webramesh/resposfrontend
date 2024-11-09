import {
  IconCarrot,
  IconChevronRight,
  IconMail,
  IconMapPin,
  IconMenu,
  IconPhone,
  IconShare,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { iconStroke } from "../config/config";

import {
  getCart,
  setCart,
  getQRMenuInit,
} from "../controllers/qrmenu.controller";
import { CURRENCIES } from "../config/currencies.config";
import { getImageURL } from "../helpers/ImageHelper";
import toast from "react-hot-toast";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getQRMenuLink } from "../helpers/QRMenuHelper";
export default function QRMenuPage() {

  const navigate = useNavigate();
  const params = useParams();
  const qrcode = params.qrcode;

  const [searchParams] = useSearchParams();
  const encryptedTableId = searchParams.get("table") ?? null;

  const [state, setState] = useState({
    isLoading: true,
    storeSettings: null,
    storeTable: null,
    categories: [],
    currentCategory: "all",
    menuItems: [],
    searchQuery: "",
    currentItem: null,
    cartItems: [],
    currentItemId: null,
    currency: "",
  });

  useEffect(() => {
    _getQRMenu(qrcode);
  }, [qrcode]);

  const _getQRMenu = async (qrcode) => {
    try {
      const res = await getQRMenuInit(qrcode, encryptedTableId);

      const storedCart = getCart();
      if (res.status == 200) {
        const data = res.data;

        const currency = CURRENCIES.find(
          (c) => c.cc == data?.storeSettings?.currency
        );

        setState({
          ...state,
          isLoading: false,
          storeSettings: data?.storeSettings,
          categories: data?.categories,
          menuItems: data?.menuItems,
          storeTable: data?.storeTable || null,
          cartItems: [...storedCart],
          currency: currency?.symbol || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isLoading,
    storeSettings,
    categories,
    menuItems,
    currentCategory,
    searchQuery,
    currentItem,
    cartItems,
    currentItemId,
    currency,
  } = state;

  const storeName = storeSettings?.store_name || "";
  const address = storeSettings?.address || "";
  const phone = storeSettings?.phone || "";
  const email = storeSettings?.email || "";
  const image = storeSettings?.image || "";
  const is_qr_menu_enabled = storeSettings?.is_qr_menu_enabled || false;
  const is_qr_order_enabled = storeSettings?.is_qr_order_enabled || false;

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 flex h-screen items-center justify-center">
          Please wait...
        </div>
      </div>
    );
  }

  if (!qrcode) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 flex h-screen items-center justify-center">
          Broken Link!
        </div>
      </div>
    );
  }

  if (!is_qr_menu_enabled) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 flex h-screen items-center justify-center">
          Menu Not Available!
        </div>
      </div>
    );
  }

  const QR_MENU_LINK = getQRMenuLink(qrcode);

  const btnShare = async () => {
    const shareData = {
      title: "Menu",
      text: "Menu",
      url: QR_MENU_LINK,
    };

    try {
      if (navigator.canShare) {
        if (navigator?.canShare(shareData)) {
          await navigator.share(shareData);
        }
      } else {
        await navigator.clipboard.writeText(QR_MENU_LINK);
        toast.success("Menu Link Copied!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const btnOpenMenuItemDetail = (
    addons,
    variants,
    category_id,
    category_title,
    id,
    imageURL,
    price,
    tax_id,
    tax_rate,
    tax_title,
    tax_type,
    title
  ) => {
    setState({
      ...state,
      currentItem: {
        addons: addons,
        variants: variants,
        category_id: category_id,
        category_title: category_title,
        id,
        image: imageURL,
        price,
        tax_id,
        tax_rate,
        tax_title,
        tax_type,
        title,
      },
    });
    document.getElementById("modal_item_detail").showModal();
  };

  // cart
  function addItemToCart(item) {
    const modifiedItem = {
      ...item,
      quantity: 1,
      notes: null,
    };

    const newCart = cartItems;

    newCart.push(modifiedItem);

    setState({
      ...state,
      cartItems: [...newCart],
    });
    setCart(newCart);
  }

  const btnAddMenuItemToCartWithVariantsAndAddon = () => {
    let price = 0;
    let selectedVariantId = null;
    const selectedAddonsId = [];

    const itemVariants = document.getElementsByName("variants");
    itemVariants.forEach((item) => {
      if (item.checked) {
        selectedVariantId = item.value;
        return;
      }
    });


    price = parseFloat(currentItem.price);

    const itemAddons = document.getElementsByName("addons");
    itemAddons.forEach((item) => {
      if (item.checked) {
        selectedAddonsId.push(item.value);
      }
    });

    const addons = currentItem?.addons || [];
    const variants = currentItem?.variants || [];

    let selectedVariant = null;
    if (selectedVariantId) {
      selectedVariant = variants.find((v) => v.id == selectedVariantId);
      price = parseFloat(selectedVariant.price);
    }

    let selectedAddons = [];
    if (selectedAddonsId.length > 0) {
      selectedAddons = selectedAddonsId.map((addonId) =>
        addons.find((addon) => addon.id == addonId)
      );
      selectedAddons.forEach((addon) => {
        const addonPrice = parseFloat(addon.price);
        price += addonPrice;
      });
    }

    const itemCart = {
      ...currentItem,
      price: price,
      variant_id: selectedVariantId,
      variant: selectedVariant,
      addons_ids: selectedAddonsId,
      addons: selectedAddons,
    };

    addItemToCart(itemCart);
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        {/* appbar */}
        <div className="bg-white shadow-lg rounded-full p-2 w-full md:w-96 mx-auto mt-4 flex gap-2 sticky top-4 z-50">
          <input
            type="search"
            name="search"
            id="search"
            className="bg-gray-100 rounded-full outline-none px-4 py-2 flex-1"
            placeholder="Search Menu..."
            value={searchQuery}
            onChange={(e) => {
              setState({
                ...state,
                searchQuery: e.target.value,
              });
            }}
          />
          <button
            className="btn btn-circle "
            onClick={() =>
              document.getElementById("modal_store_details").showModal()
            }
          >
            <IconMenu stroke={iconStroke} />
          </button>
        </div>
        {/* appbar */}

        {/* store details: name, phone, address, email, share menu link */}
        <div className="py-4 px-6 w-full md:w-96 mx-auto bg-gray-100 rounded-3xl mt-10">
          <h3 className="font-bold text-2xl mb-2">{storeName}</h3>
          {address && (
            <div className="flex gap-2 mb-2">
              <IconMapPin stroke={iconStroke} />
              <p>{address}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            {phone && (
              <a href={`tel:${phone}`} className="flex gap-2">
                <IconPhone stroke={iconStroke} />
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex gap-2">
                <IconMail stroke={iconStroke} />
                {email}
              </a>
            )}
          </div>
        </div>
        {/* store details: name, phone, address, email, share menu link */}

        {/* categories */}
        <div className="p-2 w-full md:w-96 overflow-x-auto mx-auto mt-4 flex gap-2">
          <label>
            <input
              onChange={(e) => {
                setState({
                  ...state,
                  currentCategory: e.target.value,
                });
              }}
              type="radio"
              name="category"
              id={"all"}
              value={"all"}
              className="peer hidden"
              defaultChecked
            />
            <label
              htmlFor={"all"}
              className="text-xs cursor-pointer rounded-full px-4 py-3 bg-transparent border hover:bg-gray-50 active:scale-95 transition text-gray-500 checked:bg-gray-200 peer-checked:bg-gray-200 flex"
            >
              <p>All</p>
            </label>
          </label>
          {categories.map((category, index) => {
            const { id, title } = category;
            return (
              <div key={index} className="min-w-fit">
                <input
                  onChange={(e) => {
                    setState({
                      ...state,
                      currentCategory: e.target.value,
                    });
                  }}
                  type="radio"
                  name="category"
                  id={id}
                  value={id}
                  className="peer hidden"
                />
                <label
                  htmlFor={id}
                  className="text-xs min-w-fit flex items-center cursor-pointer rounded-full px-4 py-3 bg-transparent border hover:bg-gray-50 active:scale-95 transition text-gray-500 checked:bg-gray-200 peer-checked:bg-gray-200 "
                >
                  <p>{title}</p>
                </label>
              </div>
            );
          })}
        </div>
        {/* categories */}

        {/* menu items */}
        <div className="p-2 w-full md:w-96 mx-auto mt-4 flex flex-col gap-4">
          {menuItems
            .filter((item) => {
              const { category_id } = item;
              if (currentCategory == "all") {
                return true;
              }
              if (currentCategory == category_id) {
                return true;
              }
              return false;
            })
            .filter((menuItem) => {
              if (!searchQuery) {
                return true;
              }
              return new String(menuItem.title)
                .trim()
                .toLowerCase()
                .includes(searchQuery.trim().toLowerCase());
            })
            .map((item, i) => {
              const {
                addons,
                variants,
                category_id,
                category_title,
                id,
                image,
                price,
                tax_id,
                tax_rate,
                tax_title,
                tax_type,
                title,
              } = item;
              // addon {id, item_id, title, price}
              // variant {id, item_id, title, price}

              const imageURL = getImageURL(image);
              const hasVariantOrAddon =
                variants?.length > 0 || addons?.length > 0;

              return (
                <div
                  key={id}
                  className={`w-full rounded-3xl px-4 py-4 flex gap-4  ${
                    !is_qr_order_enabled
                      ? "hover:bg-gray-100 cursor-pointer"
                      : ""
                  }`}
                  onClick={
                    !is_qr_order_enabled
                      ? () =>
                          btnOpenMenuItemDetail(
                            addons,
                            variants,
                            category_id,
                            category_title,
                            id,
                            image ? imageURL : null,
                            price,
                            tax_id,
                            tax_rate,
                            tax_title,
                            tax_type,
                            title
                          )
                      : undefined
                  }
                >
                  <div>
                    <div className="rounded-2xl w-32 h-32 object-cover relative bg-gray-200 flex items-center justify-center text-gray-500 ">
                      {image ? (
                        <img
                          src={imageURL}
                          alt={title}
                          className="w-full h-full absolute top-0 left-0 rounded-2xl object-cover z-0"
                        />
                      ) : (
                        <IconCarrot />
                      )}
                      {/* Add button overlapping image */}
                      {is_qr_order_enabled && (
                        <button
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-restro-green bg-white border border-restro-green py-1 px-6 rounded-lg font-bold hover:bg-restro-green hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (hasVariantOrAddon) {
                              btnOpenMenuItemDetail(
                                addons,
                                variants,
                                category_id,
                                category_title,
                                id,
                                image ? imageURL : null,
                                price,
                                tax_id,
                                tax_rate,
                                tax_title,
                                tax_type,
                                title
                              );
                            } else {
                              addItemToCart(item);
                            }
                          }}
                        >
                          ADD
                        </button>
                      )}
                    </div>

                    {is_qr_order_enabled &&
                      (variants.length > 0 || addons.length > 0) && (
                        <div className="text-center mt-5">
                          <p className="text-xs text-gray-500">Customisable</p>
                        </div>
                      )}
                  </div>

                  <div className="flex-1">
                    <p className="text-lg">{title}</p>
                    <p className="text-sm text-restro-green font-bold">
                      {currency}
                      {price}
                    </p>
                    {category_id && (
                      <p className="mt-2 text-xs text-gray-500">
                        Category: {category_title}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      {variants.length > 0 && (
                        <p>{variants.length} Variants available</p>
                      )}
                      {addons.length > 0 && (
                        <p>{addons.length} Addons available</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {/* menu items */}

        {is_qr_order_enabled && <div className="h-28" />}

        {is_qr_order_enabled && cartItems.length > 0 && (
          <div
            className="p-2 w-full md:w-96 mx-auto fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-between items-center rounded-2xl"
            style={{ boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <button
            onClick={() => {
              navigate(`/m/${qrcode}/cart`, {
                state: { storeTable: state.storeTable, currency: currency },
              });
            }}
            className="bg-restro-green text-white py-4 px-6 flex justify-between items-center rounded-xl w-full">
              <p className="text-md font-bold">
                {cartItems.length} Items Added
              </p>
              <p
                className="text-white text-lg font-bold px-2 rounded-lg flex gap-1 items-center"
              >
                View Cart
                <IconChevronRight size={20} stroke={3} />
              </p>
            </button>
          </div>
        )}

        {/* store details: name, phone, address, email, share menu link */}
        <dialog
          id="modal_store_details"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <div className="flex justify-end gap-4">
              <button className="btn btn-circle" onClick={btnShare}>
                <IconShare stroke={iconStroke} />
              </button>
              <form method="dialog">
                <button className="btn btn-circle">
                  <IconX stroke={iconStroke} />
                </button>
              </form>
            </div>
            <div className="py-4 px-6 w-full mx-auto bg-gray-100 rounded-3xl mt-4">
              <h3 className="font-bold text-2xl mb-2">{storeName}</h3>
              {address && (
                <div className="flex gap-2 mb-2">
                  <IconMapPin stroke={iconStroke} />
                  <p>{address}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {phone && (
                  <a href={`tel:${phone}`} className="flex gap-2">
                    <IconPhone stroke={iconStroke} />
                    {phone}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex gap-2">
                    <IconMail stroke={iconStroke} />
                    {email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </dialog>
        {/* store details: name, phone, address, email, share menu link */}

        {/* dialog for detail menu item view with addon, variants */}
        <dialog
          id="modal_item_detail"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <div className="absolute top-4 right-4">
              <form method="dialog">
                <button className="btn btn-circle">
                  <IconX stroke={iconStroke} />
                </button>
              </form>
            </div>

            <div className="w-full flex gap-4">
              <div className="rounded-2xl w-32 h-32 object-cover relative bg-gray-200 flex items-center justify-center text-gray-500 ">
                {currentItem?.image ? (
                  <img
                    src={currentItem?.image}
                    alt={currentItem?.title}
                    className="w-full h-full absolute top-0 left-0 rounded-2xl object-cover z-0"
                  />
                ) : (
                  <IconCarrot />
                )}
              </div>
              <div className="flex-1">
                <p className="text-lg">{currentItem?.title}</p>
                <p className="text-sm text-restro-green font-bold">
                  {currency}
                  {currentItem?.price}
                </p>
                {currentItem?.category_id && (
                  <p className="mt-2 text-xs text-gray-500">
                    Category: {currentItem?.category_title}
                  </p>
                )}
                <div className="flex gap-2 mt-2 text-xs text-gray-500">
                  {currentItem?.variants.length > 0 && (
                    <p>{currentItem?.variants.length} Variants available</p>
                  )}
                  {currentItem?.addons.length > 0 && (
                    <p>{currentItem?.addons.length} Addons available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="my-4 flex flex-col sm:flex-row gap-2">
              {currentItem?.variants.length > 0 && (
                <div className="flex-1">
                  <h3>Variants</h3>
                  <div className="flex flex-col gap-2 mt-2">
                    {currentItem?.variants?.map((variant, index) => {
                      const { id, title, price } = variant;
                      return (
                        <label
                          key={index}
                          className="cursor-pointer label justify-start gap-2"
                        >
                          <input
                            type="radio"
                            className="radio"
                            name="variants"
                            id={id}
                            value={id}
                            defaultChecked={index === 0}
                          />
                          <span className="label-text">
                            {title} - {currency}
                            {price}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentItem?.addons.length > 0 && (
                <div className="flex-1">
                  <h3>Addons</h3>
                  <div className="flex flex-col gap-2 mt-2">
                    {currentItem?.addons?.map((addon, index) => {
                      const { id, title, price } = addon;
                      return (
                        <label
                          key={index}
                          className="cursor-pointer label justify-start gap-2"
                        >
                          <input
                            type="checkbox"
                            name="addons"
                            className="checkbox checkbox-sm"
                            value={id}
                          />
                          <span className="label-text">
                            {title} (+{currency}
                            {price})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {is_qr_order_enabled && (
              <div className="modal-action flex justify-end w-full">
                <form method="dialog" className="w-full">
                  <button
                    onClick={() => {
                      btnAddMenuItemToCartWithVariantsAndAddon();
                    }}
                    className="w-full rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-6 py-2 bg-restro-green text-white font-bold"
                  >
                    ADD TO CART
                  </button>
                </form>
              </div>
            )}

            <p className="text-gray-500 text-xs mt-1">
              *Shown prices might be inclusive/exclusive of applicable taxes;
              refer to the final bill for payment amount.
            </p>
          </div>
        </dialog>

        {/* dialog for detail menu item view */}
      </div>
    </div>
  );
}
