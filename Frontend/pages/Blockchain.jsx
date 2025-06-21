// frontend/pages/Blockchain.jsx
import React, { useState, useEffect } from 'react';
import { getChain, getLatestBlock, getBlock, getAllTransactions, isValid, getLength } from '../src/api/blockchain';

const Blockchain = () => {
  const [chain, setChain] = useState([]);
  const [latestBlock, setLatestBlock] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isValidChain, setIsValidChain] = useState(true);
  const [chainLength, setChainLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const [chainData, latestBlockData, transactionsData, isValidData, lengthData] = await Promise.all([
        getChain(),
        getLatestBlock(),
        getAllTransactions(),
        isValid(),
        getLength()
      ]);

      setChain(chainData);
      setLatestBlock(latestBlockData);
      setAllTransactions(transactionsData);
      setIsValidChain(isValidData);
      setChainLength(lengthData);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = async (index) => {
    try {
      const block = await getBlock(index);
      setSelectedBlock(block);
      setSelectedBlockIndex(index);
    } catch (error) {
      console.error('Error loading block details:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Blockchain Explorer</h1>

        {/* Blockchain Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chain Length</h3>
            <p className="text-3xl font-bold text-blue-600">{chainLength}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold text-green-600">{allTransactions.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Latest Block</h3>
            <p className="text-3xl font-bold text-purple-600">{latestBlock?.index || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chain Status</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isValidChain ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-lg font-bold ${isValidChain ? 'text-green-600' : 'text-red-600'}`}>
                {isValidChain ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blockchain Chain */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Blockchain Chain</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chain.map((block, index) => (
                <div
                  key={index}
                  onClick={() => handleBlockClick(index)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedBlockIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">Block #{block.index}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(block.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {block.transactions?.length || 0} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Hash</div>
                      <div className="text-xs font-mono text-blue-600 truncate w-32">
                        {block.hash}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedBlock ? `Block #${selectedBlock.index} Details` : 'Block Details'}
            </h2>
            
            {selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Index</label>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                    {selectedBlock.index}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                    {new Date(selectedBlock.timestamp).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hash</label>
                  <div className="flex items-center space-x-2">
                    <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded flex-1 break-all">
                      {selectedBlock.hash}
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBlock.hash)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Hash</label>
                  <div className="flex items-center space-x-2">
                    <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded flex-1 break-all">
                      {selectedBlock.previousHash}
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBlock.previousHash)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nonce</label>
                  <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                    {selectedBlock.nonce}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transactions ({selectedBlock.transactions?.length || 0})
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedBlock.transactions && selectedBlock.transactions.length > 0 ? (
                      selectedBlock.transactions.map((tx, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">From:</span>
                              <span className="font-mono text-xs truncate max-w-32">
                                {tx.sender}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">To:</span>
                              <span className="font-mono text-xs truncate max-w-32">
                                {tx.recipient}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-mono text-xs">{tx.amount}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No transactions in this block</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a block from the chain to view its details
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          
          {allTransactions.length > 0 ? (
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
                      Block
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTransactions.slice(0, 10).map((tx, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900">
                            {tx.sender.substring(0, 10)}...
                          </span>
                          <button
                            onClick={() => copyToClipboard(tx.sender)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900">
                            {tx.recipient.substring(0, 10)}...
                          </span>
                          <button
                            onClick={() => copyToClipboard(tx.recipient)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* Find which block contains this transaction */}
                        {chain.findIndex(block => 
                          block.transactions?.some(blockTx => 
                            blockTx.sender === tx.sender && 
                            blockTx.recipient === tx.recipient && 
                            blockTx.amount === tx.amount
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
