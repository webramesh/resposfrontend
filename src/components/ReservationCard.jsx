import React from "react";
import {
  IconArmchair,
  IconCalendarX,
  IconFriends,
  IconPencil,
  IconInfoSquareRounded
} from "@tabler/icons-react";
import { iconStroke } from "../config/config";
export default function ReservationCard({
  unique_code,
  dateLocal,
  timeLocal,
  customer_name,
  people_count,
  table_title,
  notes,
  status,
  createdAt,
  btnUpdate,
  btnDelete,
}) {
  return (
    <div
      key={unique_code}
      className="text-restro-green-dark border border-restro-border-green-light rounded-2xl p-4 flex gap-4 items-center"
    >
      <div className="w-20 h-full text-base text-gray-500 py-2 font-bold text-center rounded-lg flex items-center justify-center bg-gray-100">
        {dateLocal}
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-sm">{timeLocal}</p>
        <p className="font-bold text-xl">{customer_name}</p>
        <div className="flex items-center gap-4 text-sm text-restro-green-dark">
          <div className="flex items-center gap-2">
            <IconFriends stroke={iconStroke} size={18} />
            {people_count || "N/A"}
          </div>
          <div className="flex items-center gap-2">
            <IconArmchair stroke={iconStroke} size={18} />
            {table_title || "N/A"}
          </div>
        </div>
        {notes && (
          <div className="tooltip tooltip-bottom" data-tip={notes}>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
              <IconInfoSquareRounded size={18} stroke={iconStroke} /> View Notes
            </p>
          </div>
        )}
        <p className="text-xs text-gray-400">Status: {status}</p>
        <p className="text-xs text-gray-400">Created at: {createdAt}</p>
      </div>

      <div className="flex items-center">
        <button
          onClick={btnUpdate}
          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
        >
          <IconPencil size={18} stroke={iconStroke} />
        </button>
        <button
          onClick={btnDelete}
          className="w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
        >
          <IconCalendarX size={18} stroke={iconStroke} />
        </button>
      </div>
    </div>
  );
}
