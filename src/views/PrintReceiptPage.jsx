import React from 'react'
import { getDetailsForReceiptPrint } from '../helpers/ReceiptHelper'

export default function PrintReceiptPage() {

  const receiptDetails = getDetailsForReceiptPrint();

  const { cartItems, deliveryType, customerType, customer, tableId, currency, storeSettings, printSettings, 
    itemsTotal,
    taxTotal,
    payableTotal, 
    tokenNo,
    orderId 
  } = receiptDetails;

  const {
    store_name,
    address,
    phone,
    email,
    image: storeImage,
  } = storeSettings;
  
  const {
    page_format,
    header,
    footer,
    show_notes,
    show_store_details,
    show_customer_details,
    print_token,
  } = printSettings;

  return (
    <div className={`w-[${page_format}mm] font-sans px-2`}>

      {show_store_details == 1 ? <>
        {storeImage && <img src={storeImage} className='w-12 h-12 mx-auto' />}
        <p className="text-center mt-2">
          {store_name}<br/>
          {address}<br/>
          Phone: {phone}, Email: {email}<br/>
        </p>
      </>:<></>}

      {header && <div className=''>
        <div className="border-b border-dashed"></div>
        <p className='my-2 text-center'>{header}</p>
      </div>}

      {
        show_customer_details == 1 ? <>
          <div className="border-b border-dashed"></div>
          <p className='text-center'>{customerType}{customer&&<span>, {customer?.name}</span>}</p>
          <p className='mt-1'>Order Type: {deliveryType}</p>
        </>:<></>
      }

      <div className="border-b border-dashed mt-2"></div>
      <p>Receipt No.: {tokenNo}-{new Date().toISOString().substring(0,10)}</p>
      <p>{new Date().toLocaleString()}</p>

      <div className="border-b border-dashed mt-2"></div>
      {cartItems.map((cartItem, index)=>{

        const {title, quantity, notes, price, tax_rate, tax_type, tax_title, addons, addons_ids, variant } = cartItem;

        return <div key={index} className='w-full my-1'>
          <p>{title} {variant && <span>- {variant.title}</span>}</p>
          {addons_ids?.length > 0 && <p className='text-xs'>Addons: 
          {addons_ids.map((addonId, index)=>{
            const addon = addons.find((a)=>a.id==addonId);
            return addon.title;
          })?.join(", ")}
          </p>}
          {(show_notes == 1 && notes) ? <p className='mb-2 text-xs'>Notes: {notes}</p>:<></>}
          <div className='flex justify-between w-full'>
            <p className='text-sm'>{quantity}x {currency}{Number(price).toFixed(2)}</p>
            <p className='text-end'>{currency}{Number(quantity*price).toFixed(2)}</p>
          </div>
        </div>
      })}
      <div className="border-b border-dashed mt-2"></div>

      <div className="flex justify-between">
        <p>Subtotal (excl. tax): </p>
        <p>{currency}{Number(itemsTotal).toFixed(2)}</p>
      </div>
      <div className="flex justify-between">
        <p>Tax: </p>
        <p>{currency}{Number(taxTotal).toFixed(2)}</p>
      </div>
      <div className="flex justify-between text-xl font-bold">
        <p>Total: </p>
        <p>{currency}{Number(payableTotal).toFixed(2)}</p>
      </div>

      <div className="border-b border-dashed mt-2"></div>

      {footer && <div className='my-2'>
        <p className='my-2 text-center'>{footer}</p>
      </div>}


      {print_token == 1 && tokenNo ? <div className='border-t border-dashed mt-4 py-12 text-center'>
        Token No.
        <div className="w-28 h-28 mx-auto border-black border-2 text-black flex items-center justify-center font-bold text-4xl rounded-full">
          {tokenNo}
        </div>
      </div>:<></>}

    </div>
  )
}
