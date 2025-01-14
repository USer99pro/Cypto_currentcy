import React from "react";

const CryptoDetails = ({ data }) => {
  if (!data) {
    return <p className="text-gray-500">No data available for this cryptocurrency.</p>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded shadow mb-4 text-sm">
      <p>
        <strong>Last Price:</strong>{" "}
        {data.last !== undefined ? data.last : "N/A"}
      </p>
      <p>
        <strong>24h High:</strong>{" "}
        {data.high24hr !== undefined ? data.high24hr : "N/A"}
      </p>
      <p>
        <strong>24h Low:</strong>{" "}
        {data.low24hr !== undefined ? data.low24hr : "N/A"}
      </p>
      <p>
        <strong>Change:</strong>{" "}
        {data.change !== undefined ? data.change : "N/A"}
      </p>
      <p>
        <strong>Percent Change:</strong>{" "}
        {data.percentChange !== undefined ? `${data.percentChange}%` : "N/A"}
      </p>
      <p>
        <strong>Base Volume:</strong>{" "}
        {data.baseVolume !== undefined ? data.baseVolume : "N/A"}
      </p>
      <p>
        <strong>Quote Volume:</strong>{" "}
        {data.quoteVolume !== undefined ? data.quoteVolume : "N/A"}
      </p>
    </div>
  );
};

export default CryptoDetails;
