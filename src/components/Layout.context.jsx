import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase.config.js";
import Papa from "papaparse";
import PocketBase from "pocketbase";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";

const pb = new PocketBase("http://127.0.0.1:8090");

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

  const fetchWatchlistData = async () => {
    try {
      const record = await pb
        .collection("watchlist")
        .getFirstListItem(`userId="${userId}"`);
      setWatchlist(record.watchlistItems || []);
    } catch (error) {
      console.error("Failed to fetch watchlist data:", error);
      setWatchlist([]);
    }
  };

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

  // Function to update PocketBase watchlist
  const updatePocketBaseWatchlist = async (newWatchlist) => {
    try {
      const data = {
        userId: userId,
        watchlistItems: newWatchlist,
      };

      const existingRecord = await pb
        .collection("watchlist")
        .getFirstListItem(`userId="${userId}"`)
        .catch(() => null);

      if (existingRecord) {
        await pb.collection("watchlist").update(existingRecord.id, data);
      } else {
        await pb.collection("watchlist").create(data);
      }
    } catch (error) {
      console.error("Failed to update watchlist in PocketBase:", error);
    }
  };

  const addToWatchlist = async (stock) => {
    if (watchlist.length >= 7) {
      showNotification({
        title: "Watchlist Full",
        message: "You can't add more than 7 stocks to the watchlist.",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    const isAlreadyInWatchlist = watchlist.some(
      (item) => item.symbol === stock.Symbol
    );
    if (isAlreadyInWatchlist) {
      showNotification({
        title: "Already in Watchlist",
        message: `${stock.Symbol} is already in the watchlist`,
        color: "yellow",
        icon: <IconX size={16} />,
      });
      return;
    }
    setIsAddingToWatchlist(true);
    // Add the stock immediately with placeholder data
    const newWatchlistItem = {
      companyName: stock["Company Name"],
      industry: "Loading...",
      symbol: stock.Symbol,
      pChange: 0,
      price: 0,
      maxPrice: 0,
      minPrice: 0,
      isLoading: true,
    };
    const newWatchlist = [...watchlist, newWatchlistItem];
    setWatchlist(newWatchlist);

    try {
      const stockData = await fetchStockData(stock.Symbol);
      if (stockData) {
        const updatedWatchlist = newWatchlist.map((item) =>
          item.symbol === stock.Symbol
            ? {
                ...item,
                industry: stockData.industry,
                pChange: stockData.pChange,
                price: stockData.lastPrice,
                maxPrice: stockData.maxPrice,
                minPrice: stockData.minPrice,
                isLoading: false,
              }
            : item
        );
        setWatchlist(updatedWatchlist);
        updatePocketBaseWatchlist(updatedWatchlist); // Update PocketBase only when adding to watchlist
        showNotification({
          title: "Stock Added",
          message: `${stock.Symbol} has been added to your watchlist`,
          color: "green",
          icon: <IconCheck size={16} />,
        });
      }
    } catch (err) {
      showNotification({
        title: "Error",
        message: `Error fetching data for ${stock.Symbol}: ${err.message}`,
        color: "red",
        icon: <IconX size={16} />,
      });
      setWatchlist((prev) =>
        prev.filter((item) => item.symbol !== stock.Symbol)
      );
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const updateWatchlistItem = async (symbol) => {
    const stockData = await fetchStockData(symbol);
    if (stockData) {
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((item) =>
          item.symbol === symbol
            ? {
                ...item,
                industry: stockData.industry,
                pChange: stockData.pChange,
                price: stockData.lastPrice,
                maxPrice: stockData.maxPrice,
                minPrice: stockData.minPrice,
              }
            : item
        )
      );
    }
  };

  const removeFromWatchlist = (symbol) => {
    const updatedWatchlist = watchlist.filter((item) => item.symbol !== symbol);
    setWatchlist(updatedWatchlist);
    updatePocketBaseWatchlist(updatedWatchlist); // Update PocketBase when removing from watchlist
    showNotification({
      title: "Stock Removed",
      message: `${symbol} has been removed from your watchlist`,
      color: "blue",
      icon: <IconCheck size={16} />,
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      watchlist.forEach((item) => updateWatchlistItem(item.symbol));
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [watchlist]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        watchlist,
        addToWatchlist,
        updateWatchlistItem,
        isAddingToWatchlist,
        removeFromWatchlist,
        fetchStockData,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
