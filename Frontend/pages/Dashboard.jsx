// frontend/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getBlockchain } from "../api/blockchain";
import { getPeers } from "../api/peer";
import BlockNotification from "../components/BlockNotification";

const Dashboard = () => {
  const [blockCount, setBlockCount] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [peers, setPeers] = useState([]);
  const [latestMiner, setLatestMiner] = useState("N/A");
  const [lastBlock, setLastBlock] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchStats = async () => {
    try {
      const chain = await getBlockchain();
      const newBlockCount = chain.length;

      // Detect new block mined
      const newLastBlock = chain[newBlockCount - 1];
      if (lastBlock && newLastBlock.index !== lastBlock.index) {
        setNotification(newLastBlock);
      }

      setBlockCount(newBlockCount);
      setLastBlock(newLastBlock);

      const allTx = chain.flatMap((block) => block.transactions);
      setTxCount(allTx.length);

      const miner = newLastBlock?.miner || newLastBlock?.transactions?.[0]?.sender || "Unknown";
      setLatestMiner(miner);

      const peersList = await getPeers();
      setPeers(peersList);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStats(); // initial fetch
    const interval = setInterval(fetchStats, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [lastBlock]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">📊 Network Dashboard</h1>

      {notification && (
        <BlockNotification block={notification} onClose={() => setNotification(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Blocks" value={blockCount} />
        <StatCard title="Total Transactions" value={txCount} />
        <StatCard title="Connected Peers" value={peers.length} />
        <StatCard title="Last Mined By" value={latestMiner} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🌐 Peer List</h2>
        <ul className="list-disc list-inside">
          {peers.map((peer, idx) => (
            <li key={idx}>{peer}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white rounded shadow-md border text-center">
    <div className="text-lg font-medium">{title}</div>
    <div className="text-2xl font-bold text-indigo-600">{value}</div>
  </div>
);

export default Dashboard;
