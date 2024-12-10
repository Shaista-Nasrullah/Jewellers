import React, { useState, useEffect } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../../styles/header.css";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();

  // Function to fetch search results
  const fetchSearchResults = async () => {
    if (!values.keyword) return; // Don't search if the input is empty
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form submit (when "Enter" is pressed or search icon is clicked)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchSearchResults(); // Ensure the search is performed before navigating
    navigate("/search"); // Navigate to the search results page
  };

  // Toggle search input visibility when the search icon is clicked
  const handleSearchIconClick = () => {
    if (showSearchInput && values.keyword) {
      // If the input is already visible and has a value, trigger search
      fetchSearchResults();
      navigate("/search");
    } else {
      setShowSearchInput(!showSearchInput); // Toggle input visibility
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        {showSearchInput && (
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={values.keyword}
            onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          />
        )}
        <FaSearch
          style={{ cursor: "pointer" }}
          onClick={handleSearchIconClick} // Toggle input or trigger search
        />
      </form>
    </div>
  );
};

export default SearchInput;
