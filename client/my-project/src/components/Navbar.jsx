import React from "react";
import { Button } from "./ui/button";
import { useProvider } from "@/context/Provider";

const Navbar = () => {
  const { name } = useProvider();

  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <p className="text-2xl font-bold text-indigo-600 p-3 rounded-xl">
          Scrap Builder
        </p>
      </div>
      <div className="">
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          Create Entity{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
