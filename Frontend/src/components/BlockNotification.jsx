import React from "react";

const BlockNotification = ({ block, onClose }) => {
  if (!block) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">✅ New Block Mined!</div>
          <div className="text-sm">Block #{block.index} by {block.miner || block.transactions?.[0]?.sender || "Unknown"}</div>
        </div>
        <button onClick={onClose} className="ml-4 font-bold">×</button>
      </div>
    </div>
  );
};

export default BlockNotification;
    