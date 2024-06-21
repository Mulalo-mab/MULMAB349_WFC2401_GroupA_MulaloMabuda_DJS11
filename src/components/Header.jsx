import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CategoryContext } from "./context/CategoryContext";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.jpeg";
import "./Header.css";

const Header = ({ searchQuery, onSearchChange }) => {
  const { setSelectedCategory } = useContext(CategoryContext);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleHomeClick = () => {
    setSelectedCategory("All");
  };

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  // Determine if the header should be shown based on current location
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
