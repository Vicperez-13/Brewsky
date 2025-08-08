import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/brewsky_logo.png";
import SearchBar from "../SearchBar/SearchBar";
import AuthModal from "../AuthModal/AuthModal";
import UserProfile from "../UserProfile/UserProfile";
import { useAuth } from "../AuthModal/AuthModal";

const Header = ({ onSearch, onAddCard }) => {
  const { isAuthenticated, user } = useAuth();
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openAuthModal = (mode) => {
    setAuthModal({
      isOpen: true,
      mode: mode,
    });
  };

  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      mode: "login",
    });
  };

  const switchAuthMode = () => {
    setAuthModal((prev) => ({
      ...prev,
      mode: prev.mode === "login" ? "signup" : "login",
    }));
  };

  return (
    <>
      <header className="Header">
        <div className="header__left">
          <SearchBar onSearch={onSearch} />
        </div>
        <Link to="/" className="header__logo-link">
          <img src={logo} alt="Brewsky Logo" className="Header__logo" />
        </Link>
        <div className="header__actions">
          {isAuthenticated ? (
            <button className="add-card-button" onClick={onAddCard}>
              + Add Coffee Shop
            </button>
          ) : (
            <button
              className="add-card-button disabled"
              onClick={() => openAuthModal("login")}
              title="Please log in to add coffee shops"
            >
              + Add Coffee Shop
            </button>
          )}

          {isAuthenticated ? (
            <div className="header__user">
              <Link to="/" className="home-link">
                Home
              </Link>
              <Link to="/favorites" className="favorites-link">
                Favorites
              </Link>
              <div className="user-menu">
                <button
                  className="user-avatar"
                  onClick={() => setIsProfileOpen(true)}
                >
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </button>
                <span className="user-greeting">
                  Hi, {user?.firstName || "User"}!
                </span>
              </div>
            </div>
          ) : (
            <div className="header__auths">
              <button
                className="header__auths__login"
                onClick={() => openAuthModal("login")}
              >
                Login
              </button>
              <button
                className="header__auths__signup"
                onClick={() => openAuthModal("signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onSwitchMode={switchAuthMode}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Header;
