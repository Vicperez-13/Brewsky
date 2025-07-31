import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App/App";
import Footer from "./components/Footer/Footer";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Add more routes here as you build more pages */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
