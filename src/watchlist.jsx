import React from 'react';

const Watchlist = ({ stocks, onStockClick }) => {
  return (
    <div>
      <h2>Watchlist</h2>
      <ul>
        {stocks.map(stock => (
          <li key={stock.symbol} onClick={() => onStockClick(stock.symbol)}>
            {stock.symbol}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
