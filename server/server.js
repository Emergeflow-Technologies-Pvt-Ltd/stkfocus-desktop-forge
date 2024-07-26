// An express code
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.on('error', (error) => console.log(`Server error: ${error}`));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.static(path.join(__dirname, 'public')));

const getDataFromNSE = async (symbol) => {
  const response = await fetch(
    'https://nseindia.com/api/quote-equity?symbol=' + symbol,
  )
    .then((resp) => {
      console.log('response', resp.status);
      return resp;
    })
    .catch((e) => {
      console.log('error', e);
    });

  let data = {};
  if (response.status !== 200) {
    console.log('Received Status', response.status);

    // Call NSE Data again after calling the home page
    await fetch('https://nseindia.com', {
      method: 'GET',
      headers: {
        Connection: 'keep-alive',
        'Cache-Control': 'max-age=0',
        DNT: '1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
        'Sec-Fetch-User': '?1',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
      },
    });
    data = await getDataFromNSE(symbol);
  } else {
    data = await response.json();
  }

  return data;
};

app.get('/api/get_data', (req, res) => {
  const symbol = req.query.symbol;

  const stockData = getDataFromNSE(symbol);
  console.log('stockData', stockData);
  res.status(200).res.send({ data: stockData });
});
