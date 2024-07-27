import React, { createContext, useContext, useState, useEffect } from "react";
import { useHomePageContext } from "./Homepage/HomePage.context.jsx";

const WidgetContext = createContext();

export const WidgetContextProvider = ({ children }) => {
  const { fetchStockData } = useHomePageContext();
  const [widgetStocks, setWidgetStocks] = useState([]);

  useEffect(() => {
    const fetchHardcodedStocks = async () => {
      const symbols = ["INFY", "RELIANCE", "YESBANK"];
      try {
        const stocksData = await Promise.all(
          symbols.map(async (symbol) => {
            const data = await fetchStockData(symbol);
            return { symbol, ...data };
          })
        );
        setWidgetStocks(stocksData);
      } catch (error) {
        console.error("Error fetching initial stock data:", error);
      }
    };

    fetchHardcodedStocks();
  }, [fetchStockData]);

  useEffect(() => {
    const updateWidgetStocks = async () => {
      try {
        const updatedStocks = await Promise.all(
          widgetStocks.map(async (stock) => {
            const updatedData = await fetchStockData(stock.symbol);
            return { ...stock, ...updatedData };
          })
        );
        setWidgetStocks(updatedStocks);
      } catch (error) {
        console.error("Error updating stock data:", error);
      }
    };

    // Set up interval for updates every 10 seconds
    const intervalId = setInterval(updateWidgetStocks, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [widgetStocks, fetchStockData]);

  return (
    <WidgetContext.Provider value={{ widgetStocks }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => useContext(WidgetContext);
