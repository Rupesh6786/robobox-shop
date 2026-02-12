import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const placeholderSuggestions = [
    'Robobox Kit', 'Mechatronics Kit', 'Blix Kit', 'Drone Kit',
    'Robotics Workshop', 'Masterclass', 'Components'
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    const filteredSuggestions = placeholderSuggestions.filter(
      suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/searchquer?q=${query}`;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onBlur={() => setTimeout(() => setSuggestions([]), 100)}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for products..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="absolute -right-2 -top-2 mt-[0.56rem] mr-2 px-4 py-[0.5rem] bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Search
      </button>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;