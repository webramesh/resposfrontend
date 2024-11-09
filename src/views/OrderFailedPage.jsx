import React from "react";
import { IconCircleXFilled } from '@tabler/icons-react';

function OrderFailedPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4 md:w-96 mx-auto">
      <div className="w-full md:w-96 mx-auto max-w-sm bg-white shadow-lg rounded-xl px-10 py-8 flex flex-col justify-between mx-2">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Oops! Something went wrong</p>
        </div>

        <div className="text-center mb-6">
          <IconCircleXFilled className="text-red-500 mx-auto" size={150} />
          <p className="text-md text-gray-600 tracking-wide mt-2 font-bold">
            Order Failed
          </p>
          <p className="text-sm text-gray-600 tracking-wide mt-2">
           Try Again !
          </p>
        </div>

        <div></div>

      </div>
    </div>
  );
}

export default OrderFailedPage;
