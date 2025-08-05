import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App/App";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";

const AppRouter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddCard = () => {
    setIsAddModalOpen(true);
  };

  return (
    <Router>
      <Header onSearch={handleSearch} onAddCard={handleAddCard} />
      <Routes>
        <Route
          path="/"
          element={
            <App
              searchTerm={searchTerm}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
