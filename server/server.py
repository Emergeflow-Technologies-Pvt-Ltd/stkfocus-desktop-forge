import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def nse_custom_function_secfno(symbol, attribute="lastPrice"):
    positions = nsefetch('https://www.nseindia.com/api/quote-equity?symbol='+symbol)
    return positions["priceInfo"]["lastPrice"], positions["priceInfo"]["pChange"], positions["priceInfo"]["weekHighLow"]["max"], positions["priceInfo"]["weekHighLow"]["min"], positions["info"]["companyName"], positions["info"]["industry"]

def nsefetch(payload):
    try:
        output = requests.get(payload,headers=headers).json()
        #print(output)
    except ValueError:
        s =requests.Session()
        output = s.get("http://nseindia.com",headers=headers)
        output = s.get(payload,headers=headers).json()
    return output


headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'DNT': '1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
    'Sec-Fetch-User': '?1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
}


@app.route('/api/get_data')
def get_data():
    try:
        args = request.args
        symb = args.get("symbol")

        lastPrice, pChange, maxPrice, minPrice, companyName, industry = nse_custom_function_secfno(symb, "lastPrice")

        return jsonify({
                'symbol': symb,
                'lastPrice': lastPrice if lastPrice is not None else 0,
                'pChange': pChange if pChange is not None else 0,
                'maxPrice': maxPrice if maxPrice is not None else 0,
                'minPrice': minPrice if minPrice is not None else 0,
                'companyName': companyName if companyName is not None else 'N/A',
                'industry': industry if industry is not None else 'N/A',
            })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, threaded=True)
