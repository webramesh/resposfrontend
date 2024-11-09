import React from "react";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { iconStroke } from "../config/config";
export default function Popover({text}) {
  return (
    <div className="relative">
      <IconInfoCircleFilled
        size={18}
        className="text-gray-400 peer cursor-pointer"
        stroke={iconStroke}
      />
      <p className="z-50 hidden text-sm text-gray-500 transition peer-hover:block absolute -translate-y-1/2 top-1/2 left-8 w-96 rounded-lg bg-white shadow-lg p-2">
        {text}
      </p>
    </div>
  );
}
