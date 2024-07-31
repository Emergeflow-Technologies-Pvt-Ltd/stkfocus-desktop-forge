import React, { createContext, useContext, useState, useEffect } from "react";
import { useLayoutContext } from "../Layout.context.jsx";

const WidgetContext = createContext();

export const WidgetContextProvider = ({ children }) => {
  const { fetchStockData } = useLayoutContext();
  const [widgetStocks, setWidgetStocks] = useState([]);

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

  useEffect(() => {
    // Set up interval for updates every 15 seconds
    const intervalId = setInterval(updateWidgetStocks, 15000);

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
