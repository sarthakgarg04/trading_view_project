
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import Watchlist from './watchlist'; // Import the Watchlist component
import './styles.css';

export const CandlestickChartComponent = props => {
  const {
    selectedStock,
    initialCandlesCount = 50,
    colors: { backgroundColor = '#ffff', textColor = 'black' } = {},
  } = props;

  const [data, setData] = useState([]);
  const chartContainerRef = useRef();

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Update the fetch URL to the deployed Flask server endpoint
        const response = await fetch(`http://127.0.0.1:1100/api/stockdata?symbol=${selectedStock}`);
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
      width: 1150,
      height: 700,
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

    // const initialEndDate = new Date(data[initialCandlesCount - 1]['Date']);
    // const initialStartDate = new Date(data[0]['Date']);
    // chart.timeScale().setVisibleLogicalRange({ from: initialStartDate.getTime() / 1000, to: initialEndDate.getTime() / 1000 });

    // window.addEventListener('resize', handleResize);



    window.addEventListener('resize', handleResize);
    // After setting the data and logical range, fit content to adjust the time scale
    // chart.timeScale().fitContent();

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
    <div className="app-container">
      <div className="watchlist-container">
        <Watchlist stocks={watchlist} onStockClick={handleStockClick} />
      </div>
      <div className="chart-container">
        <CandlestickChartComponent selectedStock={selectedStock} colors={{ backgroundColor: '#ffffff' }} />
      </div>
    </div>
  );
};

export default App;







