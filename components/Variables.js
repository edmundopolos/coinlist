import React, { createContext, useState } from "react";

const ContextVal = createContext({});

const ContextProvider = ({ children }) => {
  const [user, setuser] = useState({});
  const [focus, setFocus] = useState(false);
  const [coinList, setCoinList] = useState([]);

  return (
    <ContextVal.Provider
      value={{
        user,
        setuser,
        focus,
        setFocus,
        coinList,
        setCoinList,
      }}
    >
      {children}
    </ContextVal.Provider>
  );
};

export { ContextProvider, ContextVal };
