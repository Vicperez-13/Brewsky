import React from "react";
import "./Header.css";
import logo from "../../assets/brewsky_logo.png";

const Header = () => {
  return (
    <header className="Header">
      <img src={logo} alt="Brewsky Logo" className="Header__logo" />
      <div className="header__auths">
        <button className="header__auths__login">Login</button>
        <button className="header__auths__signup">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
