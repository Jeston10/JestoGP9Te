import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSystemHealth, getSystemStats } from '../src/api/system';
import { getLatestBlock } from '../src/api/blockchain';
import { getPendingTransactions } from '../src/api/transaction';

const Home = () => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [pendingTxs, setPendingTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthData, statsData, blockData, txData] = await Promise.all([
          getSystemHealth(),
          getSystemStats(),
          getLatestBlock(),
          getPendingTransactions()
        ]);
        
        setHealth(healthData);
        setStats(statsData);
        setLatestBlock(blockData);
        setPendingTxs(txData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blockchain data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">JestoGP9Te Blockchain</h1>
            <p className="text-xl mb-8">A modern, scalable blockchain platform</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/wallet"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Wallet
              </Link>
              <Link
                to="/blockchain"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Blockchain
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Dashboard */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">System Health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="text-lg font-semibold text-gray-800">Status</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">{health?.status}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Block Height</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{health?.blockHeight || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Pending Transactions</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">{health?.pendingTransactions || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800">Connected Peers</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{health?.peers || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/transaction"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Send Transaction</h3>
              <p className="text-gray-600">Create and broadcast a new transaction</p>
            </div>
          </Link>

          <Link
            to="/mining"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Mining</h3>
              <p className="text-gray-600">Mine new blocks and earn rewards</p>
            </div>
          </Link>

          <Link
            to="/tokens"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Token Management</h3>
              <p className="text-gray-600">Deploy and manage custom tokens</p>
            </div>
          </Link>
        </div>

        {/* Latest Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Block */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Block</h3>
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

          {/* Pending Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Transactions</h3>
            {pendingTxs.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingTxs.slice(0, 5).map((tx, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">From:</span>
                      <span className="font-mono truncate">{tx.sender}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">To:</span>
                      <span className="font-mono truncate">{tx.recipient}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-mono">{tx.amount}</span>
                    </div>
                  </div>
                ))}
                {pendingTxs.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{pendingTxs.length - 5} more transactions
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No pending transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;