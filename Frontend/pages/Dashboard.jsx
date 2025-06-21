// frontend/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getSystemHealth, getSystemStats } from "../src/api/system";
import { getChain } from "../src/api/blockchain";
import { getPeers } from "../src/api/peer";
import { getLatestBlock } from "../src/api/blockchain";
import BlockNotification from "../src/components/BlockNotification";

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [chain, setChain] = useState([]);
  const [peers, setPeers] = useState([]);
  const [latestBlock, setLatestBlock] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [healthData, statsData, chainData, peersData, latestBlockData] = await Promise.all([
        getSystemHealth(),
        getSystemStats(),
        getChain(),
        getPeers(),
        getLatestBlock()
      ]);

      setHealth(healthData);
      setStats(statsData);
      setChain(chainData);
      setPeers(peersData);
      setLatestBlock(latestBlockData);

      // Detect new block mined
      if (latestBlock && latestBlockData.index !== latestBlock.index) {
        setNotification(latestBlockData);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); // initial fetch
    const interval = setInterval(fetchStats, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [latestBlock]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Network Dashboard</h1>

        {notification && (
          <BlockNotification block={notification} onClose={() => setNotification(null)} />
        )}

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="text-lg font-semibold text-gray-800">System Status</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">{health?.status}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Block Height</h3>
            <p className="text-3xl font-bold text-blue-600">{health?.blockHeight || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Transactions</h3>
            <p className="text-3xl font-bold text-orange-600">{health?.pendingTransactions || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Connected Peers</h3>
            <p className="text-3xl font-bold text-green-600">{health?.peers || 0}</p>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Blocks" value={stats?.totalBlocks || 0} color="blue" />
          <StatCard title="Total Transactions" value={stats?.totalTransactions || 0} color="green" />
          <StatCard title="Pending Transactions" value={stats?.pendingTransactions || 0} color="orange" />
          <StatCard title="Connected Peers" value={stats?.connectedPeers || 0} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Block Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Block</h2>
            {latestBlock ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Index:</span>
                  <span className="font-mono text-sm">{latestBlock.index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash:</span>
                  <span className="font-mono text-sm text-blue-600 truncate">{latestBlock.hash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-mono text-sm">{latestBlock.transactions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-mono text-sm">{new Date(latestBlock.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No blocks available</p>
            )}
          </div>

          {/* Peer Network */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Peer Network</h2>
            {peers.length > 0 ? (
              <div className="space-y-2">
                {peers.map((peer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-mono text-gray-700 truncate">{peer}</span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-400 text-4xl mb-2">🌐</div>
                <p className="text-gray-500">No peers connected</p>
              </div>
            )}
          </div>
        </div>

        {/* Blockchain Validity */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Blockchain Integrity</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${health?.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-lg font-semibold ${health?.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {health?.isValid ? 'Blockchain is valid' : 'Blockchain integrity compromised'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            The blockchain integrity check verifies that all blocks are properly linked and contain valid data.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600", 
    orange: "text-orange-600",
    purple: "text-purple-600"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-lg font-medium text-gray-800 mb-2">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
    </div>
  );
};

export default Dashboard;
