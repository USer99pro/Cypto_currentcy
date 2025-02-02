import React from "react";
// import Navbar from "./components/์Navbar";  
import CryptoChart from "./components/CryptoChart";
import useCryptoData from "./hooks/useCryptoData";
import "./index.css";
import Navbar from "./components/Navbar";
const App = () => {
  const { cryptoData, error, loading } = useCryptoData();

  return (
    <div className="">
      {/* <Navbar /> */}


      <div className="">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          cryptoData &&
          Object.keys(cryptoData).length > 0 && (
            <div className="">
              {Object.keys(cryptoData).map((symbol) => (
                <CryptoChart key={symbol} symbol={symbol} cryptoData={cryptoData[symbol]} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
