import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial"; // Import the candlestick controller and element
import "chartjs-chart-financial"; // Import the plugin
import "chartjs-adapter-date-fns";

// Register required components and the CandlestickController with CandlestickElement
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement // Register CandlestickElement as well
);

const CryptoChart = ({ symbol, cryptoData }) => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (cryptoData) {
      const newCandle = {
        x: new Date().getTime(), // Use 'x' for time
        o: parseFloat(cryptoData.prevOpen),
        h: parseFloat(cryptoData.high24hr),
        l: parseFloat(cryptoData.low24hr),
        c: parseFloat(cryptoData.last),
      };
      setChartData((prevData) => [...prevData, newCandle]);
    }
  }, [cryptoData]);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy the previous chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
      const chartInstance = new ChartJS(chartRef.current, {
        type: "candlestick", // Now 'candlestick' is registered and can be used
        data: {
          datasets: [
            {
              label: `${symbol} Price`,
              data: chartData,
              borderColor: "#0d6efd",
              borderWidth: 2,
              backgroundColor: "rgba(13, 110, 253, 0.1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `${symbol}`,
              font: {
                size: 20,
              },
              padding: {
                top: 10,
                bottom: 10,
              },
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "minute",
              },
              title: {
                display: true,
                text: "Time",
                font: {
                  size: 12,
                },
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
                font: {
                  size: 12,
                },
              },
              grid: {
                color: "#e5e5e5",
              },
            },
          },
        },
      });

      // Store the chart instance for later destruction
      chartInstanceRef.current = chartInstance;

      // Cleanup function to destroy the chart when the component is unmounted or data changes
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [chartData, symbol]);

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="rounded shadow-xl overflow-hidden w-full md:flex max-w-4xl">
        {/* Chart Section */}
        <div className="flex w-full md:w-1/2 px-5 pb-4 pt-8 bg-indigo-500 text-white items-center">
          <canvas ref={chartRef} className="w-full" />
        </div>
        {/* Info Section */}
        <div className="flex w-full md:w-1/2 p-10 bg-gray-100 text-gray-600 items-center">
          <div className="w-full rounded-[32px] bg-[#292929] shadow-[inset_-22px_22px_44px_#242424,inset_22px_-22px_44px_#2e2e2e] p-6">
            <h3 className="text-lg font-semibold leading-tight text-gray-800">
              {symbol}
            </h3>
            <h6 className="text-sm leading-tight mb-2 text-gray-400">
              {cryptoData?.last} - {new Date().toLocaleString()}
            </h6>
            <div className="flex w-full items-end mb-6 text-gray-300">
              <span className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                {cryptoData?.last}
              </span>
              <span
                className={`block leading-5 text-sm ml-4 ${
                  cryptoData?.percentChange > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {cryptoData?.percentChange > 0 ? "▲" : "▼"}{" "}
                {cryptoData?.percentChange}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-semibold">Open:</div>
                <div>{cryptoData?.prevOpen}</div>
              </div>
              <div>
                <div className="font-semibold">Market Cap:</div>
                <div>{cryptoData?.quoteVolume}</div>
              </div>
              <div>
                <div className="font-semibold">High:</div>
                <div>{cryptoData?.high24hr}</div>
              </div>
              <div>
                <div className="font-semibold">P/E Ratio:</div>
                <div>N/A</div>
              </div>
              <div>
                <div className="font-semibold">Low:</div>
                <div>{cryptoData?.low24hr}</div>
              </div>
              <div>
                <div className="font-semibold">Dividend Yield:</div>
                <div>N/A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;
