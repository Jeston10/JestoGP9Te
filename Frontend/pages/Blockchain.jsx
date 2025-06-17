// frontend/pages/Blockchain.jsx
import React, { useEffect, useState } from "react";
import { getBlockchain } from "../api/blockchain";

const Blockchain = () => {
  const [chain, setChain] = useState([]);

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const data = await getBlockchain();
        setChain(data);
      } catch (err) {
        console.error("Failed to load blockchain:", err);
      }
    };

    fetchChain();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">📦 Blockchain Viewer</h1>

      <div className="space-y-6">
        {chain.map((block, idx) => (
          <div
            key={idx}
            className="border rounded-md p-4 bg-white shadow-md"
          >
            <div className="mb-2 text-sm text-gray-500">Block #{block.index}</div>
            <div className="break-all text-xs">
              <strong>Hash:</strong> {block.hash}
            </div>
            <div className="break-all text-xs">
              <strong>Prev Hash:</strong> {block.previousHash}
            </div>
            <div className="text-sm">
              <strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}
            </div>
            <div className="mt-2">
              <strong>Transactions:</strong>
              <ul className="list-disc list-inside text-sm ml-4">
                {block.transactions.map((tx, txIdx) => (
                  <li key={txIdx}>
                    {tx.sender} → {tx.recipient} : {tx.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blockchain;
