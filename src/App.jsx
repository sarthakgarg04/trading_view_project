
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import  WatchlistTab from './watchlist'; // Import the Watchlist component
import './styles.css';
import IntervalsTabs from './intervals';


const watchlist = [
  { symbol: 'RVNL.NS', name: 'RVNL' },
  { symbol: 'IRFC.NS', name: 'IRFC' },
  { symbol: 'RAILTEL.NS', name: 'RAILTEL' },
  { symbol: 'IREDA.NS', name: 'IREDA' },
  { symbol: 'BSE.NS', name: 'BSE' },
  { symbol: 'ITC.NS', name: 'ITC' },
  { symbol: 'TATAMOTORS.NS', name: 'TATAMOTORS' },
  { symbol: 'JWL.NS', name: 'JWL' },
  // Add more stocks as needed
];

const intervals = ['1mo', '1wk', '1d', '1h', '15m', '5m', '1m'];



export const CandlestickChartComponent = props => {
  const {
    selectedStock,
    selectedInterval,
    colors: { backgroundColor = '#ffff', textColor = 'black' } = {},
  } = props;

  const [data, setData] = useState([]);
  const chartContainerRef = useRef();
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:1100/api/stockdata?symbol=${selectedStock}&interval=${selectedInterval}`);
        const jsonData = await response.json();
        // console.log('Fetched data:', jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedStock, selectedInterval]);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    // Clear existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create a new chart instance
    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 1200,
      height: 750,
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);
    chartRef.current.timeScale().fitContent();

    const candlestickSeries = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.priceScale().applyOptions({
      scaleMargins: {
        // positioning the price scale for the area series
        top: 0.15,
        bottom: 0.25,
      },
    });

    

    const volumeSeries = chartRef.current.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      priceScaleId: '', 
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });

    // Set the new data

    const mappedData = data.map(item => {
      const dateTimeField = item['Datetime'] || item['Date']; // Use 'Datetime' for 1h interval, 'Date' for 1d interval
      return {
        time: Math.floor(new Date(dateTimeField).getTime() / 1000),
        open: item['Open'],
        high: item['High'],
        low: item['Low'],
        close: item['Close'],
        value: item['Volume'],
      };
    });

    candlestickSeries.setData(mappedData);
    volumeSeries.setData(mappedData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // No need to remove the chart since it's cleared and re-created
    };
  }, [data, backgroundColor, textColor, selectedStock, selectedInterval]);

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
    </div>
  );
};

const App = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [selectedInterval, setSelectedInterval] = useState('1d');

  const handleStockClick = stock => {
    console.log('Clicked on stock:', stock);
    setSelectedStock(stock);
  };

  const handleIntervalClick = interval => {
    console.log('Selected interval:', interval);
    setSelectedInterval(interval);
  };

  return (
    <div className="app-container">
      <div className="chart-watchlist-container">
        <CandlestickChartComponent selectedStock={selectedStock} selectedInterval={selectedInterval} colors={{ backgroundColor: '#ffffff' }} />
        <div className="watchlist-container">
          <WatchlistTab stocks={watchlist} onStockClick={handleStockClick} />
        </div>
      </div>
      <IntervalsTabs intervals={intervals} onIntervalClick={handleIntervalClick} selectedInterval={selectedInterval} />
    </div>
  );
};

export default App;







