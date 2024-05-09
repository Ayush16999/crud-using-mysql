import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <p className="text-2xl font-bold text-indigo-600 p-3 rounded-xl">
          Scrap Builder
        </p>
      </div>
      <div className="">
        <Button className="bg-indigo-800">Create New +</Button>
      </div>
    </div>
  );
};

export default Navbar;
