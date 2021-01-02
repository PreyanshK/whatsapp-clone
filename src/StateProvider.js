import React , { createContext, useContext, useReducer } from "react";

//prepare the data layer called context where all data lives
export const StateContext = createContext();

// Higher Order component - children: App component
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer (reducer, initialState)}>
        {children}
    </StateContext.Provider>    
);

// Pull info from the data layer
export const useStateValue = () => useContext (StateContext);
