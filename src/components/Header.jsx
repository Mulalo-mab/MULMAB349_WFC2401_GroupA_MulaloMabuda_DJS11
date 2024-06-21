import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CategoryContext } from "./context/CategoryContext";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.jpeg";
import "./Header.css";

/**
 * Header component
 * 
 * A functional React component that renders the navigation header, including a search bar, links, and user authentication controls.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.searchQuery - The current search query string.
 * @param {function} props.onSearchChange - The callback function to handle search query changes.
 * 
 * @example
 * // Example usage:
 * <Header 
 *   searchQuery={searchQuery} 
 *   onSearchChange={handleSearchChange} 
 * />
 */

const Header = ({ searchQuery, onSearchChange }) => {
  const { setSelectedCategory } = useContext(CategoryContext); // Context to manage the selected category
  const { user, logout } = useAuth(); // Custom hook to access authentication state and logout function
  const location = useLocation(); // Hook to access the current location

  /**
   * Handle click on the home link
   * Sets the selected category to "All"
   */
  const handleHomeClick = () => {
    setSelectedCategory("All");
  };

  /**
   * Handle search input change
   * 
   * @param {Object} e - The event object
   */
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  // Determine if the header should be shown based on the current location
  const showHeader = location.pathname !== "/login";

  if (!showHeader) {
    return null; // If on the login page, do not render the header
  }

  return (
    <header className="header">
      <Link to="/" className="logo-link" onClick={handleHomeClick}>
        <img src={logo} alt="Podcast Logo" className="logo" />
      </Link>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/" onClick={handleHomeClick}>
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/favorite">Favorite</Link>
              </li>
              <li className="search-container">
                <input
                  type="text"
                  placeholder="Search podcasts by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </li>
              <li>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="search-container">
                <input
                  type="text"
                  placeholder="Search podcasts by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
