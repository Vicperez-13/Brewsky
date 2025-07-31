import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App/App";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        {}
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
