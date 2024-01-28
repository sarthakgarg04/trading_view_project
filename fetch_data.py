from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime,timedelta

current_datetime = datetime.now()
current_date = current_datetime.date()

app = Flask(__name__)
CORS(app)

size={"1d":2000,
      "1h":729,
      "1wk": 5000,
      "1mo": 5000,
      "15m":59,
      "5m":59,
      "1m":7}

@app.route('/api/stockdata')
def get_stock_data():
    # Get the stock symbol from the query parameters
    stock_symbol = request.args.get('symbol', 'BSE.NS')  # Default to AAPL if not provided
    print(request.args.get('symbol'),"hi")
    interval = request.args.get('interval', '1d')  # Default to '1d' if not provided
    try:
        # Fetch historical data using yfinance
        stock_data = yf.download(stock_symbol, start=current_date-timedelta(days=size[interval]), end=current_date, interval=interval,)

        # Convert the DataFrame to a list of dictionaries
        stock_data_list = stock_data.reset_index().to_dict('records')

        return jsonify(stock_data_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=1100)
