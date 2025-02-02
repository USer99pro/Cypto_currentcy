import { useEffect, useState } from "react";
import axios from "axios";

const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symbolSearch, setSymbolSearch] = useState(["BTC", "ETH", "ADA", "SOL", "XRP"]); // ค่าเริ่มต้นเป็นอาเรย์ของ 5 เหรียญ

  const fetchData = async (symbols) => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.bitkub.com/api/market/ticker");
      //  console.log("Facth data API" + response.data); // แสดงข้อมูล API ทั้งหมด

      // ค้นหาข้อมูลของแต่ละเหรียญใน symbols
      const data = symbols.reduce((acc, symbol) => {
        const coinData = response.data[`THB_${symbol.toUpperCase()}`];
        if (coinData) {
          acc[`THB_${symbol.toUpperCase()}`] = coinData;
        }
        return acc;
      }, {});

      if (Object.keys(data).length > 0) {
        setCryptoData(data);
      } else {
        setError("ไม่พบข้อมูลเหรียญที่ค้นหา");
      }
    } catch (error) {
      setError("ไม่สามารถดึงข้อมูลได้ โปรดลองอีกครั้ง " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(symbolSearch); // ดึงข้อมูลของ 5 เหรียญตามที่ตั้งค่า
  }, [symbolSearch]); // จะทำการดึงข้อมูลเมื่อมีการเปลี่ยนแปลงค่า symbolSearch

  return { cryptoData, error, loading, setSymbolSearch };
};

export default useCryptoData;


