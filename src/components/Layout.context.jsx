import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase.config.js";
import Papa from "papaparse";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import pb from "../shared/pocketbase.js";

const LayoutContext = createContext({
  addToWatchlist: () => {},
  isUserLoggedIn: false,
  appUserId: "",
  setAppUserId: () => {},
});

export const LayoutProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [appUserId, setAppUserId] = useState();
  // const userId = "aaaaa";

  const fetchWatchlistData = async () => {
    try {
      const record = await pb
        .collection("watchlist")
        .getFirstListItem(`appUserId="${appUserId}"`);
      setWatchlist(record.watchlistItems || []);
    } catch (error) {
      console.error("Failed to fetch watchlist data:", error);
      setWatchlist([]);
    }
  };

  const processAPIResponse = async (data) => {
    return {
      symbol: data["info"]["symbol"],
      companyName: data["info"]["companyName"],
      industry: data["info"]["industry"],
      lastPrice: data["priceInfo"]["lastPrice"],
      change: data["priceInfo"]["change"],
      pChange: data["priceInfo"]["pChange"],
      maxPrice: data["priceInfo"]["intraDayHighLow"]["max"],
      minPrice: data["priceInfo"]["intraDayHighLow"]["min"],
    };
  };

  const fetchStockDataDirectlyFromNSE = async (symbol) => {
    try {
      // const response = await fetch(
      //   `http://localhost:8000/api/get_data?symbol=${symbol}`
      // );

      const headers = new Headers({
        // Connection: "keep-alive",
        "Cache-Control": "max-age=0",
        DNT: "1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36",
        "Sec-Fetch-User": "?1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      });

      let data = null;

      const response = await fetch(
        `https://nseindia.com/api/quote-equity?symbol=${symbol}`,
        { method: "GET", headers: headers }
      );

      if (response.status !== 200) {
        await fetch("https://nseindia.com", {
          method: "GET",
          headers: headers,
        });
        data = {};
      } else {
        data = await response.json();
        data = processAPIResponse(data);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
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
        appUserId: appUserId,
        watchlistItems: newWatchlist,
      };

      const existingRecord = await pb
        .collection("watchlist")
        .getFirstListItem(`appUserId="${appUserId}"`)
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
      watchlist.forEach((item, index) => {
        setTimeout(() => {
          updateWatchlistItem(item.symbol);
        }, index * 1000);
      });
    }, 17000); // 17 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [watchlist]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserLoggedIn(!!user);
    });

    if (auth.currentUser) {
      setAppUserId(auth.currentUser.uid);
    }

    return () => unsubscribe();
  }, [auth.currentUser]);

  useEffect(() => {
    if (appUserId) {
      console.log("Fetch Watchlist Data");
      fetchWatchlistData();
    }
  }, [appUserId]);

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
        appUserId,
        setAppUserId,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
