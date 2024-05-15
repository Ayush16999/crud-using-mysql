import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[50vh] rounded-3xl flex justify-center gap-6 flex-col bg-red-200 items-center">
      <p className="text-6xl font-bold text-red-600">404</p>
      <p className="text-xl font-bold text-red-600">PAGE NOT FOUND!</p>
      <Button onClick={() => navigate("/")} className="">
        Back to homepage
      </Button>
    </div>
  );
};

export default ErrorPage;
