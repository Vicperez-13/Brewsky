import React, { useState } from "react";
import "./FilterSort.css";

const FilterSort = ({ onSort, onFilter, totalCount, filteredCount }) => {
  const [sortBy, setSortBy] = useState("date");
  const [filterRating, setFilterRating] = useState(0);
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterNameRange, setFilterNameRange] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    onSort(newSortBy);
    setFilterRating(0);
    setFilterDateRange("all");
    setFilterNameRange("all");
    onFilter({ rating: 0, dateRange: "all", nameRange: "all" });
  };

  const handleRatingFilterChange = (rating) => {
    setFilterRating(rating);
    onFilter({ rating, dateRange: "all", nameRange: "all" });
  };

  const handleDateFilterChange = (dateRange) => {
    setFilterDateRange(dateRange);
    onFilter({ rating: 0, dateRange, nameRange: "all" });
  };

  const handleNameFilterChange = (nameRange) => {
    setFilterNameRange(nameRange);
    onFilter({ rating: 0, dateRange: "all", nameRange });
  };

  const clearFilters = () => {
    setFilterRating(0);
    setFilterDateRange("all");
    setFilterNameRange("all");
    setSortBy("date");
    onFilter({ rating: 0, dateRange: "all", nameRange: "all" });
    onSort("date");
  };

  const hasActiveFilters =
    filterRating > 0 || filterDateRange !== "all" || filterNameRange !== "all";

  const renderFilterSection = () => {
    switch (sortBy) {
      case "rating":
        return (
          <div className="panel-section">
            <h4 id="filter-heading">Filter by Rating</h4>
            <div
              className="rating-filter"
              role="radiogroup"
              aria-labelledby="filter-heading"
            >
              <button
                className={filterRating === 0 ? "active" : ""}
                onClick={() => handleRatingFilterChange(0)}
                role="radio"
                aria-checked={filterRating === 0}
                aria-label="Show all ratings"
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className={filterRating === rating ? "active" : ""}
                  onClick={() => handleRatingFilterChange(rating)}
                  role="radio"
                  aria-checked={filterRating === rating}
                  aria-label={`Show ${rating} cups and above`}
                >
                  {rating}+ ☕
                </button>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div className="panel-section">
            <h4 id="filter-heading">Filter by Date Added</h4>
            <div
              className="date-filter"
              role="radiogroup"
              aria-labelledby="filter-heading"
            >
              <button
                className={filterDateRange === "all" ? "active" : ""}
                onClick={() => handleDateFilterChange("all")}
                role="radio"
                aria-checked={filterDateRange === "all"}
                aria-label="Show all dates"
              >
                All Time
              </button>
              <button
                className={filterDateRange === "week" ? "active" : ""}
                onClick={() => handleDateFilterChange("week")}
                role="radio"
                aria-checked={filterDateRange === "week"}
                aria-label="Show last week"
              >
                Last Week
              </button>
              <button
                className={filterDateRange === "month" ? "active" : ""}
                onClick={() => handleDateFilterChange("month")}
                role="radio"
                aria-checked={filterDateRange === "month"}
                aria-label="Show last month"
              >
                Last Month
              </button>
              <button
                className={filterDateRange === "year" ? "active" : ""}
                onClick={() => handleDateFilterChange("year")}
                role="radio"
                aria-checked={filterDateRange === "year"}
                aria-label="Show last year"
              >
                Last Year
              </button>
            </div>
          </div>
        );

      case "name":
        return (
          <div className="panel-section">
            <h4 id="filter-heading">Filter by Name</h4>
            <div
              className="name-filter"
              role="radiogroup"
              aria-labelledby="filter-heading"
            >
              <button
                className={filterNameRange === "all" ? "active" : ""}
                onClick={() => handleNameFilterChange("all")}
                role="radio"
                aria-checked={filterNameRange === "all"}
                aria-label="Show all names"
              >
                All
              </button>
              <button
                className={filterNameRange === "a-g" ? "active" : ""}
                onClick={() => handleNameFilterChange("a-g")}
                role="radio"
                aria-checked={filterNameRange === "a-g"}
                aria-label="Show names A through G"
              >
                A - G
              </button>
              <button
                className={filterNameRange === "h-n" ? "active" : ""}
                onClick={() => handleNameFilterChange("h-n")}
                role="radio"
                aria-checked={filterNameRange === "h-n"}
                aria-label="Show names H through N"
              >
                H - N
              </button>
              <button
                className={filterNameRange === "o-s" ? "active" : ""}
                onClick={() => handleNameFilterChange("o-s")}
                role="radio"
                aria-checked={filterNameRange === "o-s"}
                aria-label="Show names O through S"
              >
                O - S
              </button>
              <button
                className={filterNameRange === "t-z" ? "active" : ""}
                onClick={() => handleNameFilterChange("t-z")}
                role="radio"
                aria-checked={filterNameRange === "t-z"}
                aria-label="Show names T through Z"
              >
                T - Z
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="filter-sort-container">
      <button
        className={`filter-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="filter-sort-panel"
        aria-label="Toggle filter and sort options"
      >
        <span>Filter & Sort</span>
        {hasActiveFilters && <span className="filter-indicator">•</span>}
      </button>

      {isOpen && (
        <div
          id="filter-sort-panel"
          className="filter-sort-panel"
          role="region"
          aria-label="Filter and sort controls"
        >
          <div className="panel-section">
            <h4 id="sort-heading">Sort By</h4>
            <div
              className="sort-options"
              role="radiogroup"
              aria-labelledby="sort-heading"
            >
              <button
                className={sortBy === "date" ? "active" : ""}
                onClick={() => handleSortChange("date")}
                role="radio"
                aria-checked={sortBy === "date"}
                aria-label="Sort by date added"
              >
                Date Added
              </button>
              <button
                className={sortBy === "rating" ? "active" : ""}
                onClick={() => handleSortChange("rating")}
                role="radio"
                aria-checked={sortBy === "rating"}
                aria-label="Sort by rating"
              >
                Rating
              </button>
              <button
                className={sortBy === "name" ? "active" : ""}
                onClick={() => handleSortChange("name")}
                role="radio"
                aria-checked={sortBy === "name"}
                aria-label="Sort by name"
              >
                Name
              </button>
            </div>
          </div>

          {renderFilterSection()}

          {hasActiveFilters && (
            <div className="panel-section">
              <button
                className="clear-filters"
                onClick={clearFilters}
                aria-label="Clear all active filters"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="results-count" aria-live="polite">
            Showing {filteredCount} of {totalCount} coffee shops
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSort;
