import React from "react";
import Navbar from "./components/์Navbar";
import CryptoChart from "./components/CryptoChart";
import useCryptoData from "./hooks/useCryptoData";
import "./index.css";

const App = () => {
  const { cryptoData, error, loading } = useCryptoData();

  return (
    <div className="">
      {/* เพิ่ม Navbar */}
      <Navbar />
      
      <div className="">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          cryptoData &&
          Object.keys(cryptoData).length > 0 && ( // ตรวจสอบว่า cryptoData มีค่าหรือไม่
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(cryptoData).map((symbol) => (
                <div key={symbol} className="border p-4 rounded shadow bg-white">
                  <h2 className="text-lg font-semibold mb-2">{symbol}</h2>
                  <CryptoChart symbol={symbol} cryptoData={cryptoData[symbol]} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
