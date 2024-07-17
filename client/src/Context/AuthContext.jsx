// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("userData") || "{}");
    const apiToken = store?.data?.token;
    if (!apiToken) {
         setAuthenticated(false);

    } else {
      setAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
