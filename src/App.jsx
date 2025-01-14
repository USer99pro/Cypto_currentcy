import React from "react";
import CryptoChart from "./components/CryptoChart";
import CryptoDetails from "./components/CryptoDetails";
import useCryptoData from "./hooks/useCryptoData";
import "./index.css";

const App = () => {
  const { cryptoData, error, loading } = useCryptoData();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Crypto Price Tracker</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        cryptoData &&
        Object.keys(cryptoData).length > 0 && ( // ตรวจสอบว่า cryptoData มีค่าหรือไม่
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
            {Object.keys(cryptoData).map((symbol) => (
              <div key={symbol} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold mb-2 text-center">
                  {symbol}
                </h2>
                <CryptoDetails data={cryptoData[symbol]} />
                <div className="mt-4">
                  <CryptoChart
                    symbol={symbol}
                    cryptoData={cryptoData[symbol]}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default App;
