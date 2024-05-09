import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StoreContextProvider } from "./context/Provider.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreContextProvider>
    <App />
    <Toaster />
  </StoreContextProvider>
);
