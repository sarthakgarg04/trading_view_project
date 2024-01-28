import React from 'react';
import './styles.css';


const WatchlistTab = ({ stocks, onStockClick,selectedInterval }) => {

    
    
  return (
    <div>
      <h2>Watchlist</h2>
      <ul>
        {stocks.map(stock => (
          <li key={stock.symbol} onClick={() => onStockClick(stock.symbol)}>
            {stock.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WatchlistTab;
