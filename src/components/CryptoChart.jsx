import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS,CategoryScale,LinearScale,TimeScale,Tooltip, Legend, Title, } from "chart.js";
import { CandlestickController,CandlestickElement, } from "chartjs-chart-financial";
import "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement
);

const CryptoChart = ({ symbol, cryptoData }) => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (cryptoData) {
      const newCandle = {
        x: new Date().getTime(),
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
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const chartInstance = new ChartJS(chartRef.current, {
        type: "candlestick",
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
              text: `${symbol} Price Chart`,
              font: {
                size: 30,
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

      chartInstanceRef.current = chartInstance;

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [chartData, symbol]);

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="rounded shadow-xl overflow-hidden w-full md:flex max-w-5xl">
        {/* Chart Section */}
        <div className="flex w-full md:w-2/3 px-5 pb-4 pt-8 bg-indigo-500 text-white items-center">
          <canvas
            ref={chartRef}
            className="w-full h-[900px] max-w-[800px] mx-auto"
          />
        </div>
        {/* Info Section */}
        <div className="flex w-full md:w-1/3 p-10 bg-gray-100 text-gray-600 items-center">
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
                <div className="font-semibold text-gray-200">Open:</div>
                <div>{cryptoData?.prevOpen}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-200">Market Cap:</div>
                <div>{cryptoData?.quoteVolume}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-200">High:</div>
                <div>{cryptoData?.high24hr}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-200">P/E Ratio:</div>
                <div>N/A</div>
              </div>
              <div>
                <div className="font-semibold text-gray-200">Low:</div>
                <div>{cryptoData?.low24hr}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-200">
                  Dividend Yield:
                </div>
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
