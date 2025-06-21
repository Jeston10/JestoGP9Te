// frontend/pages/Mining.jsx
import React, { useState, useEffect } from 'react';
import { mineBlock } from '../src/api/mining';
import { getLatestBlock, getChain } from '../src/api/blockchain';
import { getPendingTransactions } from '../src/api/transaction';

const Mining = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningStatus, setMiningStatus] = useState('');
  const [latestBlock, setLatestBlock] = useState(null);
  const [pendingTxs, setPendingTxs] = useState([]);
  const [chain, setChain] = useState([]);
  const [minedBlocks, setMinedBlocks] = useState([]);
  const [miningHistory, setMiningHistory] = useState([]);

  useEffect(() => {
    loadMiningData();
    const interval = setInterval(loadMiningData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMiningData = async () => {
    try {
      const [blockData, txData, chainData] = await Promise.all([
        getLatestBlock(),
        getPendingTransactions(),
        getChain()
      ]);

      setLatestBlock(blockData);
      setPendingTxs(txData);
      setChain(chainData);
    } catch (error) {
      console.error('Error loading mining data:', error);
    }
  };

  const handleMineBlock = async () => {
    if (pendingTxs.length === 0) {
      setMiningStatus('No transactions to mine');
      return;
    }

    setIsMining(true);
    setMiningStatus('Mining in progress...');

    try {
      const result = await mineBlock();
      setMiningStatus('Block mined successfully!');
      
      // Add to mining history
      const newMiningRecord = {
        timestamp: new Date().toLocaleString(),
        result: result,
        transactionsMined: pendingTxs.length
      };
      setMiningHistory(prev => [newMiningRecord, ...prev.slice(0, 9)]); // Keep last 10 records
      
      // Reload data
      await loadMiningData();
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setMiningStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error mining block:', error);
      setMiningStatus('Mining failed: ' + error.message);
    } finally {
      setIsMining(false);
    }
  };

  const getMiningDifficulty = () => {
    // This would typically come from the blockchain configuration
    return 3; // Default difficulty
  };

  const getMiningReward = () => {
    // This would typically be calculated based on the blockchain rules
    return 10; // Default mining reward
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mining Dashboard</h1>

        {/* Mining Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mining Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <button
                onClick={handleMineBlock}
                disabled={isMining || pendingTxs.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isMining || pendingTxs.length === 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isMining ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Mining...
                  </div>
                ) : (
                  'Start Mining'
                )}
              </button>
              
              {miningStatus && (
                <div className={`mt-4 px-4 py-2 rounded-md ${
                  miningStatus.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : miningStatus.includes('failed')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {miningStatus}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Mining Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-mono">{getMiningDifficulty()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mining Reward:</span>
                    <span className="font-mono">{getMiningReward()} coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Transactions:</span>
                    <span className="font-mono">{pendingTxs.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mining Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Latest Block</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Index:</span>
                <span className="font-mono">{latestBlock?.index || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hash:</span>
                <span className="font-mono text-xs truncate max-w-32">
                  {latestBlock?.hash || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions:</span>
                <span className="font-mono">{latestBlock?.transactions?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chain Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Blocks:</span>
                <span className="font-mono">{chain.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chain Height:</span>
                <span className="font-mono">{chain.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Genesis Block:</span>
                <span className="font-mono">Block #0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mining Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${isMining ? 'text-green-600' : 'text-gray-600'}`}>
                  {isMining ? 'Active' : 'Idle'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Can Mine:</span>
                <span className={`font-semibold ${pendingTxs.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pendingTxs.length > 0 ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blocks Mined:</span>
                <span className="font-mono">{minedBlocks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Transactions</h2>
          
          {pendingTxs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTxs.map((tx, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {tx.sender.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {tx.recipient.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">⛏️</div>
              <p className="text-gray-500 text-lg">No transactions to mine</p>
              <p className="text-gray-400 text-sm mt-2">Create some transactions first to start mining</p>
            </div>
          )}
        </div>

        {/* Mining History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mining History</h2>
          
          {miningHistory.length > 0 ? (
            <div className="space-y-3">
              {miningHistory.map((record, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{record.result}</p>
                      <p className="text-sm text-gray-600">{record.timestamp}</p>
                      <p className="text-sm text-gray-600">
                        {record.transactionsMined} transaction(s) mined
                      </p>
                    </div>
                    <div className="text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-500">No mining history yet</p>
              <p className="text-gray-400 text-sm mt-2">Start mining to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mining;
