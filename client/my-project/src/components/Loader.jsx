import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full bg-black/70 absolute z-50 top-0 left-0">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
