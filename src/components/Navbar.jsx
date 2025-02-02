import { useState } from 'react';

// Search Component
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center border p-2 rounded-lg bg-gray-800">
      <input 
        type="text" 
        placeholder="ค้นหาเหรียญ..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        className="p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
      />
      <button 
        onClick={handleSearch} 
        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-r-lg ml-2 focus:outline-none"
      >
        ค้นหา
      </button>
    </div>
  );
}

// Coin Dropdown Component
function CoinDropdown({ coins, onSelectCoin }) {
  return (
    <select 
      onChange={(e) => onSelectCoin(e.target.value)} 
      className="bg-gray-700 text-white p-2 rounded-lg"
    >
      {coins.map(coin => (
        <option key={coin.id} value={coin.id} className="bg-gray-700">
          {coin.name}
        </option>
      ))}
    </select>
  );
}

// Navbar Component
function Navbar() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const coins = [
    { id: 'btc', name: 'Bitcoin' },
    { id: 'eth', name: 'Ethereum' },
    { id: 'xrp', name: 'XRP' },
    // เพิ่มเหรียญที่ต้องการ
  ];

  const handleSearch = (query) => {
    // ค้นหาเหรียญจาก query และอัพเดต searchResults
    // ตัวอย่างการกรอง
    const results = coins.filter(coin => coin.name.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(results);
  };

  const handleSelectCoin = (coinId) => {
    setSelectedCoin(coinId);
    // เปลี่ยนหน้าหรือแสดงกราฟของเหรียญ
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <SearchBar onSearch={handleSearch} />
      <div className="flex items-center space-x-4">
        <CoinDropdown coins={searchResults.length ? searchResults : coins} onSelectCoin={handleSelectCoin} />
        {selectedCoin && <p className="text-white">เลือกเหรียญ: {selectedCoin}</p>}
      </div>
    </nav>
  );
}

export default Navbar;
