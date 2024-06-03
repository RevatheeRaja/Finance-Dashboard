import React, { createContext, useContext, useState } from "react";

const GridContext = createContext();

export const GridProvider = ({ children }) => {
  // Define your initial state here
  const [gridState, setGridState] = useState({
    result: { data: [], total: 0 },
    dataState: {
      take: 10,
      skip: 0,
      group: [],
    },
    currentSelectedState: {},
    collapsedState: [],
  });

  return (
    <GridContext.Provider value={{ gridState, setGridState }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => useContext(GridContext);
