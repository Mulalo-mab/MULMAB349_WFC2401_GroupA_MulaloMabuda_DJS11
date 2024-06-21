import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Importing Header component
import Home from "./components/Home"; // Importing Home component
import Favorite from "./components/Favorite"; // Importing Favorite component
import Show from "./components/Show"; // Importing Show component
import Login from "./components/Login"; // Importing Login component
import PrivateRoute from "./components/PrivateRoute"; // Importing PrivateRoute component
import { CategoryProvider } from "./components/context/CategoryContext"; // Importing CategoryProvider from context
import { FavoritesProvider } from "./contexts/FavoritesContext"; // Importing FavoritesProvider from context
import { AuthProvider } from "./contexts/AuthContext"; // Importing AuthProvider from context

const App = () => {
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );

  // Function to handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    localStorage.setItem("searchQuery", query); // Store search query in localStorage
  };

  // Effect to update localStorage when searchQuery changes
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  return (
    <CategoryProvider> {/* Provides Category context */}
      <FavoritesProvider> {/* Provides Favorites context */}
        <AuthProvider> {/* Provides Authentication context */}
          <Router> {/* Router component for managing navigation */}
            <div>
              {/* Header component with search functionality */}
              <Header
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
              <Routes> {/* Nested Routes component for defining route configurations */}
                {/* Route for Login page */}
                <Route path="/login" element={<Login />} />
                {/* Route for Home page, wrapped in PrivateRoute */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Home searchQuery={searchQuery} />
                    </PrivateRoute>
                  }
                />
                {/* Route for Favorite page, wrapped in PrivateRoute */}
                <Route
                  path="/favorite"
                  element={
                    <PrivateRoute>
                      <Favorite />
                    </PrivateRoute>
                  }
                />
                {/* Route for Show details page, wrapped in PrivateRoute */}
                <Route
                  path="/show/:showId"
                  element={
                    <PrivateRoute>
                      <Show />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </FavoritesProvider>
    </CategoryProvider>
  );
};

export default App;
