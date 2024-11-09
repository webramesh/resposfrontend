import { IconCalendarPlus, IconCalendarTime, IconMail, IconPhone, IconUser, IconX } from "@tabler/icons-react";
import React from "react";
import { iconStroke } from "../config/config";

export default function CustomerCard({phone, name, email, birth_date=null, gender=null, created_at=null, btnAction = null}) {
  return (
    <div
      className="border border-restro-border-green-light rounded-2xl px-4 py-5"
    >
      <div className="flex items-center gap-2">
        <div className="flex w-12 h-12 rounded-full items-center justify-center bg-gray-100 text-gray-400">
          <IconUser />
        </div>
        <div className="flex-1">
          <p>{name}</p>
          <p className="text-sm flex items-center gap-1 text-gray-500">
            <IconPhone stroke={iconStroke} size={18} /> {phone}
          </p>
        </div>

        {
          btnAction && <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 active:scale-95 transition" onClick={btnAction}>
            <IconX stroke={iconStroke} size={18} />
          </button>
        }
      </div>

      {email && (
        <p className="mt-4 text-sm flex flex-wrap items-center gap-1 text-gray-500 truncate ">
          <IconMail stroke={iconStroke} size={18} /> {email}
        </p>
      )}
      {birth_date && (
        <p className="text-sm flex items-center gap-1 text-gray-500">
          Birth Date: {new Date(birth_date).toLocaleDateString()}
        </p>
      )}
      {gender && (
        <p className="text-sm flex items-center gap-1 text-gray-500">
          Gender: {gender}
        </p>
      )}

      {created_at && <div className="mt-4 text-sm flex items-center gap-1 text-gray-500">
        <IconCalendarPlus stroke={iconStroke} size={18} />{" "}
        {new Date(created_at).toLocaleString()}
      </div>}
    </div>
  );
}
