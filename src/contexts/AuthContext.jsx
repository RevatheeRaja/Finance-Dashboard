/* import { createContext, useEffect, useState, useReducer } from "react";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const lsRef = typeof window !== "undefined" ? window.localStorage : null;
    // receiving the login information from local storage
    const loginSession = JSON.parse(lsRef.getItem("login")) || {
      loggedIn: false,
      authUser: {},
    };
    const [loggedIn, setLoggedIn] = useState(loginSession.loggedIn);
  const [authUser, setAuthUser] = useState(loginSession.authUser);

  // it will be called any time that the (loggedIn and authUser) changed
  useEffect(() => {
    lsRef.setItem(
      "login",
      JSON.stringify({ loggedIn: loggedIn, authUser: authUser })
    );
}, [loggedIn, authUser]);

  return (
    <AuthContext.Provider
    value={{
      loggedIn,
      setLoggedIn,
      authUser,
      setAuthUser,
    
    }}
  >
    {children}
  </AuthContext.Provider>  )
}

 */