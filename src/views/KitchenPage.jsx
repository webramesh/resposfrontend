import React, { useContext, useEffect, useState } from "react";
import Page from "../components/Page";
import { iconStroke } from "../config/config";
import { IconArmchair, IconBoxSeam, IconCheck, IconChecks, IconClock, IconRefresh, IconX } from "@tabler/icons-react";
import { getKitchenOrders, updateKitchenOrderItemStatus, useKitchenOrders } from "../controllers/kitchen.controller";
import { toast } from "react-hot-toast";
import { SocketContext } from "../contexts/SocketContext";
import { initSocket } from "../utils/socket";
import { textToSpeech } from "../utils/textToSpeech";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
export default function KitchenPage() {
  const { socket, isSocketConnected } = useContext(SocketContext);

  const [state, setState] = useState({
    kitchenOrders: [],
    isLoading: true,
  })

  useEffect(()=>{
    _init();
    _initSocket();
  },[])

  const { kitchenOrders, isLoading } = state;

  const _init = async () => {
    try {
      const res = await getKitchenOrders();

      if(res.status == 200) {
        const orders = res?.data || [];
        
        setState({
          ...state,
          kitchenOrders: orders || [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error loading orders! Please try later!");

      setState({
        ...state,
        isLoading: false,
      });
    }
  }

  const _initSocket = () => {
    const audio = new Audio("/new_order_sound.mp3");
    if(isSocketConnected) {
      socket.on('new_order', (payload)=>{
        console.log(payload);
        // textToSpeech(`New order received, token number: ${payload}`)
        audio.play();
        btnRefresh();
      })

      socket.on("order_update", ()=>{
        console.log("Order update");
        btnRefresh();
      });
    } else {
      initSocket();
      socket.on('new_order', (payload)=>{
        console.log(payload);
        // textToSpeech(`New order received, token number: ${payload}`)
        audio.play();
        btnRefresh();
      })

      socket.on("order_update", ()=>{
        console.log("Order update");
        btnRefresh();
      });
    }
  }

  const sendOrderUpdateEvent = () => {
    const user = getUserDetailsInLocalStorage();

    if (isSocketConnected) {
      socket.emit('order_update_backend', {}, user.tenant_id);
    } else {
      // Handle disconnected state (optional)
      initSocket();
      socket.emit('order_update_backend', {}, user.tenant_id);
    }
  }

  async function btnRefresh() {
    try {
      toast.loading("Please wait...");
      const res = await getKitchenOrders();

      if(res.status == 200) {
        toast.dismiss();
        const orders = res?.data || [];
        
        setState({
          ...state,
          kitchenOrders: orders || [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error loading orders! Please try later!");

      setState({
        ...state,
        isLoading: false,
      });
    }
  }

  const btnStartPreparingOrderItem = async (orderItemId) => {
    try {
      toast.loading("Please wait...");
      const res = await updateKitchenOrderItemStatus(orderItemId, 'preparing');
      toast.dismiss();
      if(res.status == 200) {
        await btnRefresh();
        sendOrderUpdateEvent();
        toast.success(res.data.message);
      } 
    } catch (error) {
      const message = error?.response?.data?.message || "Error processing your request, Please try later!";
      toast.dismiss();
      console.error(error);
      toast.error(message);
    }
  }
  const btnCompletePreparingOrderItem = async (orderItemId) => {
    try {
      toast.loading("Please wait...");
      const res = await updateKitchenOrderItemStatus(orderItemId, 'completed');
      toast.dismiss();
      if(res.status == 200) {
        sendOrderUpdateEvent();
        await btnRefresh();
        toast.success(res.data.message);
      } 
    } catch (error) {
      const message = error?.response?.data?.message || "Error processing your request, Please try later!";
      toast.dismiss();
      console.error(error);
      toast.error(message);
    }
  }

  return (
    <Page>
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light">Kitchen</h3>
        <button
          onClick={btnRefresh}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconRefresh size={22} stroke={iconStroke} /> Refresh
        </button>
      </div>

      {isLoading && <p>Please wait...</p>}

      {kitchenOrders?.length == 0 && (
        <div className="w-full h-[calc(100vh-15vh)] flex gap-4 flex-col items-center justify-center">
          <img
            src="/assets/illustrations/kitchen.svg"
            alt="no orders"
            className="w-full md:w-60"
          />
          <p className="text-gray-400">No Orders Pending!</p>
        </div>
      )}

      {
        kitchenOrders?.length > 0 && <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">

        {
          kitchenOrders.map((order, index)=>{

            const {
              id,
              date,
              delivery_type,
              customer_type,
              customer_id,
              customer_name,
              table_id,
              table_title,
              floor,
              status,
              payment_status,
              token_no,
              items,
            } = order;

            return <div key={index} className="border border-restro-border-green-light rounded-2xl px-4 py-5 flex flex-col">
              <div className="flex items-center flex-col md:flex-row md:justify-between text-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex w-12 h-12 rounded-full items-center justify-center bg-gray-100 text-gray-400">
                    {delivery_type == "dinein" ? <IconArmchair size={24} stroke={iconStroke} />:<IconBoxSeam size={24} stroke={iconStroke} />}
                  </div>
                  <div>
                    <p className="font-bold">{table_id?`${table_title}`:new String(`${delivery_type} ${customer_type}`).toUpperCase()}</p>
                    {floor && <p className="text-sm">{floor}</p>}
                  </div>
                </div>
                <div className="text-end">
                  <p className="font-bold">Token: {token_no}</p>
                </div>
              </div>

              {/* order items */}
              <div className="mt-4 flex flex-col divide-y">
                {
                  items.map((item, index)=>{
                    const {
                      id: orderItemId,
                      order_id,
                      item_id,
                      item_title,
                      variant_id,
                      variant_title,
                      quantity,
                      status,
                      date,
                      addons,
                      notes,
                    } = item;

                    const addonsText = addons?.length > 0 ? addons?.map((a)=>a.title)?.join(", "):null;

                    return  <div key={index} className="flex items-center gap-2 py-2">
                      {/* status */}
                      {status == "preparing" && <IconClock stroke={iconStroke} className="text-amber-500" />}
                      {status == "completed" && <IconCheck stroke={iconStroke} className="text-green-500" />}
                      {status == "cancelled" && <IconX stroke={iconStroke} className="text-red-500" />}
                      {status == "delivered" && <IconChecks stroke={iconStroke} className="text-green-500" />}
                      {/* status */}
    
                      {/* item title */}
                      <div className="flex-1">
                        <p>{item_title} {variant_title} x {quantity}</p>
                        {addonsText && <p className="text-sm text-gray-700">Addons: {addonsText}</p>}
                        {notes && <p className="text-sm text-gray-700">Notes: {notes}</p>}
                      </div>
                      {/* item title */}
    
                      {/* action */}
                      {status == "created" && <button onClick={()=>{btnStartPreparingOrderItem(orderItemId)}} className="btn btn-sm">Start Making</button>}
                      {status == "preparing" && <button onClick={()=>{btnCompletePreparingOrderItem(orderItemId)}} className="btn btn-sm">Complete</button>}
                      {/* action */}
                    </div>
                  })
                }
               
              </div>
              {/* order items */}
            </div>

          })
        }

      </div>
      }
    </Page>
  );
}
