import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useProvider } from "@/context/Provider";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ifCollection = location.pathname.split("/");
  const collectionName = ifCollection[2];

  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <span
          onClick={() => navigate("/")}
          className="text-2xl cursor-pointer font-bold text-indigo-600 p-3 rounded-xl"
        >
          Scrap Builder
        </span>
      </div>
      <div className="">
        {ifCollection[1] === "collection" ? (
          <Button
            onClick={() => navigate(`/collection/${collectionName}/add-row`)}
            className="bg-indigo-800 hover:bg-indigo-700 gap-2"
          >
            Add {collectionName}
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
        ) : (
          <Button
            onClick={() => navigate("/create-collection")}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            Create Collection{" "}
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
        )}
      </div>
    </div>
  );
};

export default Navbar;
