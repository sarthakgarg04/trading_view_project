
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import Watchlist from './watchlist'; // Import the Watchlist component


export const CandlestickChartComponent = props => {

  const [selectedStock, setSelectedStock] = useState('AAPL');
  const {
    colors: {
      backgroundColor = '#ffff',
      textColor = 'black',
    } = {},
  } = props;

  const [data, setData] = useState([]);
  const chartContainerRef = useRef();

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Update the fetch URL to the deployed Flask server endpoint
        const response = await fetch(`http://127.0.0.1:1100/api/stockdata`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedStock]);


  useEffect(() => {
    if (!data) {
      return;
    }
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 1000,
      height: 600,
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chart.timeScale().fitContent();

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const mappedData = data.map(item => ({
      time: new Date(item['Date']).getTime() / 1000,
      open: item['Open'],
      high: item['High'],
      low: item['Low'],
      close: item['Close'],
    }));

    candlestickSeries.setData(mappedData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, textColor, selectedStock]);

  return (
    <div
      ref={chartContainerRef}
    />
  );
};


const App = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');

  const watchlist = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    // Add more stocks as needed
  ];

  const handleStockClick = stock => {
    console.log('Clicked on stock:', stock);
    setSelectedStock(stock);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Watchlist stocks={watchlist} onStockClick={handleStockClick} />
      <CandlestickChartComponent selectedStock={selectedStock} />
    </div>
  );
};

export default App;


// export default function App() {
//   return (
//     <CandlestickChartComponent />
//   );
// }







