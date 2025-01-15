import React, { useState } from "react";
import useCryptoData from "../hooks/useCryptoData"; // นำเข้า custom hook

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState(""); // สถานะของคำค้นหา
  const { setSymbolSearch } = useCryptoData(); // ฟังก์ชันที่ใช้ในการเปลี่ยนแปลงค่าการค้นหา

  // ฟังก์ชันที่ใช้ในการค้นหาหลังจากที่กด Enter หรือกดปุ่มค้นหา
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      setSymbolSearch(searchTerm); // ส่งคำค้นหาที่ป้อนเข้าไปใน hook
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          CryptoTracker
        </div>

        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="ค้นหาคริปโต (เช่น BTC, ETH, ADA)"
              className="px-4 py-2 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าเมื่อผู้ใช้พิมพ์
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 rounded-r text-white hover:bg-indigo-600 focus:outline-none"
            >
              ค้นหา
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
