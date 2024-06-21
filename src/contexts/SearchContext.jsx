import React, { createContext, useState } from 'react';

// Create a context object for managing search state
export const SearchContext = createContext();

// Provider component to manage search state
export const SearchProvider = ({ children }) => {
  // State to hold the current search query, initialized as an empty string
  const [searchQuery, setSearchQuery] = useState('');

  // Provide the SearchContext with search query state and setter function
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
