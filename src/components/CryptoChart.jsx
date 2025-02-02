import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useCryptoData from "../hooks/useCryptoData";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CryptoChart({ symbol }) {
  const { cryptoData, loading, error } = useCryptoData();
  const [chartData, setChartData] = useState([]);
  const [lastPrice, setLastPrice] = useState(null);

  const sanitizedSymbol = symbol.startsWith("THB_")
    ? symbol.replace("THB_", "")
    : symbol;

  useEffect(() => {
    const interval = setInterval(() => {
      if (cryptoData && cryptoData[`THB_${sanitizedSymbol.toUpperCase()}`]) {
        const coinData = cryptoData[`THB_${sanitizedSymbol.toUpperCase()}`];
        let currentTime = Math.floor(Date.now() / 1000) * 1000;

        setChartData((prevData) => {
          // Ensure unique timestamps
          if (
            prevData.length > 0 &&
            prevData[prevData.length - 1].time === currentTime
          ) {
            currentTime += 1000;
          }

          const newCandle = {
            time: currentTime,
            open:
              lastPrice !== null ? lastPrice : parseFloat(coinData.prevOpen),
            high: parseFloat(coinData.high24hr),
            low: parseFloat(coinData.low24hr),
            close: parseFloat(coinData.last),
          };

          if (
            !isNaN(newCandle.open) &&
            !isNaN(newCandle.high) &&
            !isNaN(newCandle.low) &&
            !isNaN(newCandle.close)
          ) {
            const updatedData = [...prevData, newCandle];
            return updatedData.slice(-60); // Retaining last 10 additional points
          }
          return prevData;
        });

        setLastPrice(parseFloat(coinData.last));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cryptoData, sanitizedSymbol, lastPrice]);

  const data = {
    labels: chartData.map((point) =>
      new Date(point.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Price (THB)",
        data: chartData.map((point) => point.close),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 16 / 9,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: { size: 14 },
        },
      },
      y: {
        ticks: {
          color: "#fff",
          font: { size: 14 },
        },
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex flex-row">
      <div
        className="w-2/3 bg-gray-800 p-4 flex justify-center items-center"
        style={{ height: "600px" }}
      >
        <Line data={data} options={options} />
      </div>
      <div className="w-1/3 bg-gray-700 p-6 text-white flex flex-col gap-4 rounded-b-2xl shadow-lg h-full min-h-[600px]">
        {cryptoData[`THB_${sanitizedSymbol.toUpperCase()}`] ? (
          <>
            <div className="text-center mb-3">
              <h3 className="text-2xl font-bold">
                🚀 {sanitizedSymbol.toUpperCase()}{" "}
              </h3>
            </div>

            {[
              { label: "💰 ราคาล่าสุด", key: "last" },
              { label: "📈 ราคาสูงสุดใน 24 ชม.", key: "high24hr" },
              { label: "📉 ราคาต่ำสุดใน 24 ชม.", key: "low24hr" },
              { label: "📊 ปริมาณซื้อขาย (เหรียญ)", key: "baseVolume" },
              { label: "📊 ปริมาณซื้อขาย (THB)", key: "quoteVolume" },
              { label: "📉 การเปลี่ยนแปลงราคา", key: "change" },
            ].map(({ label, key }) => (
              <div
                key={key}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-lg font-medium">{label}</span>
                <span className="text-lg font-semibold text-green-400">
                  {cryptoData[`THB_${sanitizedSymbol.toUpperCase()}`]?.[key] ||
                    "N/A"}
                </span>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center">❌ ไม่มีข้อมูลสำหรับเหรียญนี้</p>
        )}
      </div>
    </div>
  );
}
