/* eslint-disable no-undef */
console.log("This is from the server!!!");
// An express code
const express = require("express");
const cors = require("cors");
const { NseIndia } = require("stock-nse-india");

const app = express();
app.use(cors());

const nseIndia = new NseIndia();

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/get_data", async (req, res) => {
  const symbol = req.query.symbol;

  const stockData = await nseIndia.getEquityDetails(symbol).then((details) => {
    return details;
  });
  res.json({
    symbol: stockData["info"]["symbol"],
    companyName: stockData["info"]["companyName"],
    industry: stockData["info"]["industry"],
    lastPrice: stockData["priceInfo"]["lastPrice"],
    change: stockData["priceInfo"]["change"],
    pChange: stockData["priceInfo"]["pChange"],
    maxPrice: stockData["priceInfo"]["intraDayHighLow"]["max"],
    minPrice: stockData["priceInfo"]["intraDayHighLow"]["min"],
  });
});

app.get("/api/get_nifty_data", async (req, res) => {
  const response = await nseIndia
    .getData("https://www.nseindia.com/api/marketStatus")
    .then((details) => {
      return details;
    });

  res.json({
    niftyData: response["marketState"][0],
  });
});

// app.get("/api/get_all_stock_symbols", async (req, res) => {
//   const response = await nseIndia.getAllStockSymbols().then((symbols) => {
//     return symbols;
//   });

//   res.json({
//     symbolsList: response,
//   });
// });

export default app;
