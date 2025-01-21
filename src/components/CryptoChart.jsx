import { useEffect, useState, useRef } from "react";
import useCryptoData from "../hooks/useCryptoData";
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend, Title, LineController } from "chart.js";
import "chartjs-adapter-date-fns";

// ลงทะเบียนโมดูล Chart.js
ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend, Title, LineController);

const CryptoChart = () => {
  const { cryptoData, loading, error, setSymbolSearch } = useCryptoData();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // อัปเดตข้อมูลกราฟเมื่อ cryptoData เปลี่ยน
  useEffect(() => {
    if (cryptoData && cryptoData[`THB_${selectedSymbol}`]) {
      const newPoint = {
        x: new Date().getTime(),
        y: parseFloat(cryptoData[`THB_${selectedSymbol}`].last),
      };
      setChartData((prevData) => [...prevData.slice(-50), newPoint]); // เก็บข้อมูลล่าสุดไม่เกิน 50 จุด
    }
  }, [cryptoData, selectedSymbol]);

  // สร้างและอัปเดต Chart.js
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        // ทำลายกราฟเก่า
        chartInstanceRef.current.destroy();
      }

      // สร้างกราฟใหม่
      const chartInstance = new ChartJS(chartRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              label: `${selectedSymbol} Price (THB)`,
              data: chartData,
              borderColor: "#0d6efd",
              borderWidth: 2,
              backgroundColor: "rgba(13, 110, 253, 0.2)",
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: `${selectedSymbol} Price Chart`, font: { size: 30 } },
            legend: { display: false },
          },
          scales: {
            x: { type: "time", time: { unit: "minute" }, title: { display: true, text: "Time", font: { size: 30 } }, grid: { drawOnChartArea: false } },
            y: { title: { display: true, text: "Price (THB)", font: { size: 14 } }, grid: { color: "#e5e5e5" } },
          },
        },
      });

      chartInstanceRef.current = chartInstance;

      // ล้างกราฟเมื่อ component ถูกทำลาย
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [chartData, selectedSymbol]);

  const handleSymbolChange = (event) => {
    const newSymbol = event.target.value.toUpperCase();
    setSelectedSymbol(newSymbol);
    setSymbolSearch([newSymbol]); // อัปเดต symbolSearch ใน hook
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex flex-col items-center px-6 py-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* กราฟ */}
      <div className="w-full max-w-[1000px] p-5 bg-white rounded-lg shadow-lg">
        <canvas ref={chartRef} className="w-full h-[1300px]" />
      </div>

      {/* ตัวเลือกเหรียญ */}
      <div className="mt-6">
        <select
          value={selectedSymbol}
          onChange={handleSymbolChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="ADA">ADA</option>
          <option value="SOL">SOL</option>
          <option value="XRP">XRP</option>
        </select>
      </div>

      {/* ข้อมูลเพิ่มเติม */}
      {cryptoData && cryptoData[`THB_${selectedSymbol}`] && (
        <div className="flex flex-wrap justify-between items-center w-full max-w-[1000px] bg-gray-100 text-gray-700 mt-6 p-6 rounded-lg shadow-lg">
          <div className="text-center w-1/2 sm:w-1/4">
            <h3 className="text-sm font-medium text-gray-500">Last Price</h3>
            <p className="text-lg font-semibold">{cryptoData[`THB_${selectedSymbol}`].last || "N/A"}</p>
          </div>
          <div className="text-center w-1/2 sm:w-1/4">
            <h3 className="text-sm font-medium text-gray-500">24H High</h3>
            <p className="text-lg font-semibold">{cryptoData[`THB_${selectedSymbol}`].high24hr || "N/A"}</p>
          </div>
          <div className="text-center w-1/2 sm:w-1/4">
            <h3 className="text-sm font-medium text-gray-500">24H Low</h3>
            <p className="text-lg font-semibold">{cryptoData[`THB_${selectedSymbol}`].low24hr || "N/A"}</p>
          </div>
          <div className="text-center w-1/2 sm:w-1/4">
            <h3 className="text-sm font-medium text-gray-500">Change (%)</h3>
            <p className="text-lg font-semibold">{cryptoData[`THB_${selectedSymbol}`].percentChange || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoChart;
