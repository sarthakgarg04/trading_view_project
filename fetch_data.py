from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime

current_datetime = datetime.now()
current_date = current_datetime.date()

app = Flask(__name__)
CORS(app)

@app.route('/api/stockdata')
def get_stock_data():
    # Get the stock symbol from the query parameters
    stock_symbol = request.args.get('symbol', 'BSE.NS')  # Default to AAPL if not provided
    print(request.args.get('symbol'),"hi")
    try:
        # Fetch historical data using yfinance
        stock_data = yf.download(stock_symbol, start='2021-01-01', end=current_date)

        # Convert the DataFrame to a list of dictionaries
        stock_data_list = stock_data.reset_index().to_dict('records')

        return jsonify(stock_data_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=1100)
