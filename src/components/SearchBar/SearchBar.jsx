import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, placeholder = "Search coffee shops..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form className="SearchBar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="SearchBar__input"
      />
      {searchTerm && (
        <button
          type="button"
          className="SearchBar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button type="submit" className="SearchBar__button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
