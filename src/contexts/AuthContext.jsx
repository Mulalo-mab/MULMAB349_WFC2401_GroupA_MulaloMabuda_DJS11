import React, { createContext, useContext, useState } from 'react';

// Create a new context for authentication
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component manages authentication state and functions
export const AuthProvider = ({ children }) => {
  // State to hold the current user, fetched from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null; // Parse stored user data from localStorage
  });

  // Function to validate email format using regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate that the password contains only numbers
  const isValidPassword = (password) => {
    const passwordRegex = /^\d+$/;
    return passwordRegex.test(password);
  };

  // Login function with email and numeric password validation
  const login = (username, password) => {
    if (isValidEmail(username) && isValidPassword(password)) {
      const user = { username };
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
      setUser(user); // Update user state
      return true; // Return true for successful login
    }
    return false; // Return false if login fails
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null); // Clear user state
  };

  // Provide the AuthContext with user state, login, and logout functions to children components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};
