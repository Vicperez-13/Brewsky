import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthModal/AuthModal";
import { ToastProvider } from "./components/Toast/ToastProvider";
import App from "./components/App/App";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import FavoritesPage from "./components/FavoritesPage/FavoritesPage";

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
    <AuthProvider>
      <ToastProvider>
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
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
          <Footer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppRouter;
