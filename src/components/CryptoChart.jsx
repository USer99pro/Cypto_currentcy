import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Title } from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

// ลงทะเบียนส่วนประกอบที่จำเป็นของ Chart.js
ChartJS.register(
  CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Title, CandlestickController, CandlestickElement
);

const CryptoChart = ({ symbol, cryptoData }) => {
  // สร้างคอมโพเนนต์หลักสำหรับแสดงกราฟแท่งเทียนและข้อมูลคริปโตเคอเรนซี
  const [chartData, setChartData] = useState([]);
  // สร้าง state สำหรับเก็บข้อมูลของกราฟแท่งเทียน
  const chartRef = useRef(null);
  // ใช้ useRef เพื่ออ้างอิงถึง <canvas> สำหรับวาดกราฟ
  const chartInstanceRef = useRef(null);
  // ใช้ useRef เพื่อเก็บอินสแตนซ์ของกราฟ (Chart.js instance)

  // อัปเดตข้อมูลกราฟเมื่อ cryptoData เปลี่ยนแปลง
  useEffect(() => {
    if (cryptoData) {
      const newCandle = {
        x: new Date().getTime(),
        // แกน X เป็นเวลาปัจจุบัน
        o: parseFloat(cryptoData.prevOpen),
        // ราคาเปิด
        h: parseFloat(cryptoData.high24hr),
        // ราคาสูงสุดใน 24 ชั่วโมง
        l: parseFloat(cryptoData.low24hr),
        // ราคาต่ำสุดใน 24 ชั่วโมง
        c: parseFloat(cryptoData.last),
        // ราคาปัจจุบัน
      };
      setChartData((prevData) => [...prevData, newCandle]);
      // เพิ่มข้อมูลแท่งเทียนใหม่เข้าไปใน state
    }
  }, [cryptoData]);

  // สร้างกราฟ Chart.js เมื่อข้อมูลกราฟหรือ symbol เปลี่ยน
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        // ลบกราฟเก่าก่อนสร้างกราฟใหม่
      }

      const chartInstance = new ChartJS(chartRef.current, {
        type: "candlestick",
        // กำหนดชนิดของกราฟเป็นแท่งเทียน
        data: {
          datasets: [
            {
              label: `${symbol} Price`,
              // ชื่อกราฟ (ชื่อคริปโต)
              data: chartData,
              // ข้อมูลแท่งเทียน
              borderColor: "#0d6efd",
              // สีขอบของกราฟ
              borderWidth: 2,
              backgroundColor: "#240750",
              // สีพื้นหลังของกราฟ
            },
          ],
        },
        options: {
          responsive: true,
          // ให้กราฟตอบสนองกับการปรับขนาดจอ
          maintainAspectRatio: false,
          // ปิดการรักษาอัตราส่วนของกราฟ
          plugins: {
            title: {
              display: true,
              // แสดงชื่อกราฟ
              text: `${symbol} Price Chart`,
              // ข้อความของชื่อกราฟ
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
              // ปิดการแสดง legend
            },
          },
          scales: {
            x: {
              type: "time",
              // แกน X แสดงเป็นเวลา
              time: {
                unit: "minute",
                // หน่วยของเวลาเป็นนาที
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
                // ไม่แสดงเส้นตารางในแกน X
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
                // สีของเส้นตารางในแกน Y
              },
            },
          },
        },
      });

      chartInstanceRef.current = chartInstance;
      // เก็บอินสแตนซ์ของกราฟเพื่อใช้งานภายหลัง

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          // ทำลายกราฟเมื่อคอมโพเนนต์ถูก unmount
        }
      };
    }
  }, [chartData, symbol]);

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex flex-col items-center justify-center px-9 py-5">
      {/* ส่วนของกราฟ */}
      <div className="w-full px-5 pb-4 pt-8 bg-indigo-500 text-white items-center justify-center">
        <canvas ref={chartRef} className="w-full h-[600px] max-w-[1000px] mx-auto" />
      </div>

      {/* ส่วนของข้อมูล */}
      <div className="flex w-full p-5 bg-gray-100 text-gray-400 items-center justify-center mt-5">
        <div className="w-full rounded-[32px] bg-[#292929] shadow-[inset_-22px_22px_44px_#242424,inset_22px_-22px_44px_#2e2e2e] p-6">
          <h3 className="text-lg font-semibold leading-tight text-gray-500">
            {symbol}
            {/* ชื่อของคริปโต */}
          </h3>
          <h6 className="text-lg leading-tight mb-2 text-gray-400">
            {cryptoData?.last} - {new Date().toLocaleString()}
            {/* ราคาปัจจุบันและเวลาปัจจุบัน */}
          </h6>
          <div className="flex w-full items-end mb-6 text-gray-300">
            <span className="grid grid-cols-2 gap-4 text-lg text-gray-400">
              {cryptoData?.last}
              {/* ราคาล่าสุด */}
            </span>
            <span
              className={`block leading-5 text-sl ml-4 ${
                cryptoData?.percentChange > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {cryptoData?.percentChange > 0 ? "▲" : "▼"}
              {/* แสดงสัญลักษณ์ ▲ หรือ ▼ ขึ้นกับการเปลี่ยนแปลงของราคา */}
              {cryptoData?.percentChange}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-lg">
            {/* ข้อมูลเพิ่มเติม เช่น ราคาเปิด ราคาสูงสุด/ต่ำสุด ฯลฯ */}
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
              <div className="font-semibold text-gray-200">Dividend Yield:</div>
              <div>N/A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;
