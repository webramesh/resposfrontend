import { IconCreditCard } from "@tabler/icons-react";
import React from "react";
import { iconStroke } from "../config/config";
import { cancelSubscription, useSubscriptionDetails } from "../controllers/auth.controller";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function SubscriptionDetails() {
  const navigate = useNavigate();
  const { error, isLoading, data } = useSubscriptionDetails();

  if(isLoading) {
    return <div>Please wait...</div>
  }

  if(error) {
    console.error(error);
    return <div>Error loading the subscription details! Try later!</div>
  }  

  const btnCancelSubscription = async () => {
    const subscriptionId = data?.subscription_id;

    const isConfirm = window.confirm('Are you sure? This will immediately cancel your subscription, and you will lose out access to the product.');

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await cancelSubscription(subscriptionId);
      if(res.status == 200) {
        toast.dismiss();
        toast.success(res.data.message);

        navigate("/dashboard/inactive-subscription");
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Oops! We got issues while processing your request! Please try after sometime! Or contact customer support!";
      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <div className="w-full md:w-96 rounded-3xl border border-restro-green-light px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-restro-green text-white">
          <IconCreditCard stroke={iconStroke} />
        </div>
        <p>Subscription Details</p>
      </div>

      <p className="mt-4">Status: {data?.is_active?"Active": "In-Active"}</p>
      <p className="mt-2">Renews at: {new String(data?.subscription_end).substring(0, 10)}</p>

      <button onClick={btnCancelSubscription} className="w-full block mt-4 bg-red-50 text-red-500 px-4 py-2 rounded-2xl transition hover:bg-red-100 active:scale-95 text-sm">
        Cancel Subscription
      </button>
    </div>
  );
}
