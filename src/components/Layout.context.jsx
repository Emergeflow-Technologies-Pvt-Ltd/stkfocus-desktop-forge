import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase.config.js";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <LayoutContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
