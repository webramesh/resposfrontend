import React from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";

function OrderSuccessPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4 md:w-96 mx-auto">
      <div className="w-full md:w-96 mx-auto max-w-sm bg-white shadow-lg rounded-xl px-10 py-8 flex flex-col justify-between mx-2">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Thank you for choosing us !
          </p>
        </div>

        <div className="text-center mb-6">
          <IconCircleCheckFilled className="text-restro-green mx-auto" size={150} />
          <p className="text-md text-gray-600 tracking-wide mt-2 font-bold">
            Order Placed Successfully
          </p>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccessPage;
