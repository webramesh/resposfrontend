import React from 'react'
import Page from "../../components/Page";
import { IconBrandGmail, IconCopy, IconExternalLink, IconMail, IconX } from "@tabler/icons-react";
import { iconStroke, supportEmail } from "../../config/config";
import toast from 'react-hot-toast';


export default function SuperAdminContactSupportPage() {
  const email = supportEmail;

  return (
    <Page>
      <h3>Contact Support</h3>

      <div className="mt-6 w-full lg:max-w-lg rounded-2xl px-4 py-3 border flex items-center gap-8 justify-between">
        <p className='text-2xl'>
          Need Help?<br/>
          <span className="text-base font-normal">
            Facing any issues, Custom Feature, New App Development, New Project, connect with us we will respond in 24 hrs. <br/> Mail: <b><u>{email}</u></b>
          </span>
        </p>

        <button onClick={()=>{
          document.getElementById("mailto").showModal();
        }} className='mailtoui flex items-center gap-2 justify-center rounded-full text-white bg-restro-green px-4 py-3'><IconMail stroke={iconStroke} /> {email}</button>
      </div>

      <dialog id="mailto" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Send mail!</h3>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost"><IconX stroke={iconStroke} /></button>
            </form>  
          </div>
          
          <div className="flex gap-2 mt-4">
            <input type="email" id='mailto_email' disabled value={email} className='input input-bordered input-disabled flex-1' />
            <button onClick={()=>{
              const mailElem = document.getElementById("mailto_email");

              mailElem.select();

              navigator.clipboard.writeText(mailElem.value);
              toast.success("Copied to clipboard!");
            }} className='btn bg-gray-600 text-white'><IconCopy stroke={iconStroke} />Copy</button>
          </div>


          <div className="border-b my-6"></div>

          <p className='text-center mb-2'>or open with...</p>

          <a href={`mailto:${email}`} className='flex items-center gap-2 transition active:scale-95 bg-gray-100 hover:bg-gray-200 px-4 rounded-full py-3 text-gray-600'><IconMail stroke={iconStroke} />Default Mail App</a>

          <a target='_blank' href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=&cc=&bcc=&body=`} className='flex items-center gap-2 transition active:scale-95 bg-gray-100 hover:bg-gray-200 px-4 rounded-full py-3 text-gray-600 mt-2'><IconBrandGmail stroke={iconStroke} />GMail in Browser</a>
        </div>

      </dialog>
    </Page>
  )
}
