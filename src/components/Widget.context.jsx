import React, { createContext, useContext, useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090"); // Replace with your PocketBase URL

const WidgetContext = createContext();

export const WidgetContextProvider = ({ children, userId }) => {
  const [watchlist, setWatchlist] = useState([]);

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

  useEffect(() => {
    fetchWatchlistData();
    const unsubscribe = pb.collection("watchlist").subscribe("*", (e) => {
      if (e.action === "update" && e.record.userId === userId) {
        setWatchlist(e.record.watchlistItems);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <WidgetContext.Provider value={{ watchlist, fetchWatchlistData }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
