import React, { createContext, useContext, useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import { filterCompaniesList } from "../../shared/constants/companiesList.js";

const HomePageContext = createContext({
  allStocks: [],
  searchResults: [],
  searchTerm: "",
  setSearchTerm: () => {},
  isLoading: false,
});

export const HomePageContextwithProvider = ({ children, userId }) => {
  const [searchResults, setSearchResults] = useState([]);
  // const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

  // Filtering data based on search term
  useEffect(() => {
    setIsLoading(true);
    const companiesList = filterCompaniesList(searchTerm);
    setSearchResults(companiesList);
    setIsLoading(false);
  }, [searchTerm]);

  const openWidget = () => {
    window.electronAPI.createWidgetWindow(watchlist);
  };

  // Fetching data from NSE
  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/get_data?symbol=${symbol}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  return (
    <HomePageContext.Provider
      value={{
        searchResults,
        searchTerm,
        setSearchTerm,
        isLoading,
        error,
        setError,
        isAddingToWatchlist,
        searchError,
        setSearchError,
        openWidget,
        fetchStockData,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageContext = () => {
  return useContext(HomePageContext);
};
