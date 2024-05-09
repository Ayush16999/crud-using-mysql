import { useContext, createContext } from "react";

const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={{ name: "Ayush" }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useProvider = () => {
  return useContext(StoreContext);
};

export { StoreContext, StoreContextProvider };
