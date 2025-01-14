import { useEffect, useState } from "react";
import axios from "axios";

const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const cryptoSymbols = ["THB_BTC", "THB_ETH", "THB_ADA", "THB_SOL", "THB_XRP"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.bitkub.com/api/market/ticker");
        console.log(response.data); // Log all API data
        const data = cryptoSymbols.reduce((acc, symbol) => {
          if (response.data[symbol]) {
            acc[symbol] = response.data[symbol];
          }
          return acc;
        }, {});
        setCryptoData(data);
      } catch (error) {
        setError("Failed to fetch data. Please try again later. " + error.message);
      } finally {
        setLoading(false);
      }
      console.log("Fetched crypto data:", cryptoData);

    };

    fetchData();
  }, []);

  return { cryptoData, error, loading };

};

export default useCryptoData;