// frontend/pages/Mining.jsx
import React, { useState } from "react";
import { mineBlock } from "../api/mining";

const Mining = () => {
  const [minedBlock, setMinedBlock] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMine = async () => {
    try {
      setLoading(true);
      const block = await mineBlock();
      setMinedBlock(block);
    } catch (error) {
      console.error("Mining failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">💎 Mining Dashboard</h1>

      <button
        onClick={handleMine}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow"
        disabled={loading}
      >
        {loading ? "⛏️ Mining..." : "Start Mining"}
      </button>

      {minedBlock && (
        <div className="mt-4 bg-gray-100 p-4 rounded border border-gray-300">
          <h2 className="text-xl font-semibold mb-2">🧱 Mined Block</h2>
          <div><strong>Index:</strong> {minedBlock.index}</div>
          <div><strong>Hash:</strong> {minedBlock.hash}</div>
          <div><strong>Previous Hash:</strong> {minedBlock.previousHash}</div>
          <div><strong>Timestamp:</strong> {minedBlock.timestamp}</div>
          <div>
            <strong>Transactions:</strong>
            <ul className="ml-4 list-disc">
              {minedBlock.transactions.map((tx, idx) => (
                <li key={idx}>{tx.sender} → {tx.recipient} : {tx.amount}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mining;
