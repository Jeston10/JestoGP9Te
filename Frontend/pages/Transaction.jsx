// frontend/pages/Transaction.jsx
import React, { useState, useEffect } from 'react';
import { createTransaction, getPendingTransactions } from '../src/api/transaction';
import { getAllTransactions } from '../src/api/blockchain';
import { getWalletAddress } from '../src/api/wallet';

const Transaction = () => {
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    amount: ''
  });
  const [pendingTxs, setPendingTxs] = useState([]);
  const [allTxs, setAllTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current wallet address
      const address = await getWalletAddress();
      setCurrentAddress(address);
      setFormData(prev => ({ ...prev, sender: address }));

      // Load transactions
      const [pending, all] = await Promise.all([
        getPendingTransactions(),
        getAllTransactions()
      ]);
      
      setPendingTxs(pending);
      setAllTxs(all);
    } catch (error) {
      console.error('Error loading transaction data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sender || !formData.recipient || !formData.amount) {
      setMessage('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const transaction = {
        sender: formData.sender,
        recipient: formData.recipient,
        amount: parseFloat(formData.amount)
      };

      const result = await createTransaction(transaction);
      setMessage('Transaction created successfully!');
      
      // Reset form
      setFormData({
        sender: currentAddress,
        recipient: '',
        amount: ''
      });

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setMessage('Failed to create transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Transaction Management</h1>

        {/* Create Transaction Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Transaction</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="sender"
                    value={formData.sender}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sender address"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.sender)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>

            {message && (
              <div className={`px-4 py-2 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Transaction...' : 'Create Transaction'}
            </button>
          </form>
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
            <p className="text-gray-500 text-center py-4">No pending transactions</p>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
          
          {allTxs.length > 0 ? (
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
                  {allTxs.map((tx, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transaction history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
