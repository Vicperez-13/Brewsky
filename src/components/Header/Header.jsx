import React, { useState } from "react";
import "./Header.css";
import logo from "../../assets/brewsky_logo.png";
import SearchBar from "../SearchBar/SearchBar";
import AuthModal from "../AuthModal/AuthModal";

const Header = ({ onSearch, onAddCard }) => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login", 
  });

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
        <img src={logo} alt="Brewsky Logo" className="Header__logo" />
        <div className="header__actions">
          <button className="add-card-button" onClick={onAddCard}>
            + Add Coffee Shop
          </button>
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
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onSwitchMode={switchAuthMode}
      />
    </>
  );
};

export default Header;
