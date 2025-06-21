// frontend/pages/Token.jsx
import React, { useState, useEffect } from 'react';
import { getTokenBalance, mintToken, transferToken } from '../src/api/token';
import { getWalletAddress } from '../src/api/wallet';

const Tokens = () => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [mintForm, setMintForm] = useState({ to: '', amount: '' });
  const [transferForm, setTransferForm] = useState({ from: '', to: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenHistory, setTokenHistory] = useState([]);

  useEffect(() => {
    loadTokenData();
  }, []);

  const loadTokenData = async () => {
    try {
      const address = await getWalletAddress();
      setCurrentAddress(address);
      setMintForm(prev => ({ ...prev, to: address }));
      setTransferForm(prev => ({ ...prev, from: address }));

      // Load token balance
      try {
        const balance = await getTokenBalance(address);
        setTokenBalance(balance);
      } catch (error) {
        console.log('No token balance available');
        setTokenBalance(0);
      }
    } catch (error) {
      console.error('Error loading token data:', error);
    }
  };

  const handleMintTokens = async (e) => {
    e.preventDefault();
    
    if (!mintForm.to || !mintForm.amount) {
      setMessage('Please fill in all fields');
      return;
    }

    if (parseFloat(mintForm.amount) <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await mintToken(mintForm.to, mintForm.amount);
      setMessage('Tokens minted successfully!');
      
      // Add to history
      const newRecord = {
        type: 'mint',
        timestamp: new Date().toLocaleString(),
        to: mintForm.to,
        amount: mintForm.amount,
        result: result
      };
      setTokenHistory(prev => [newRecord, ...prev.slice(0, 9)]);
      
      // Reset form
      setMintForm({ to: currentAddress, amount: '' });
      
      // Reload balance
      await loadTokenData();
      
      // Reset message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error minting tokens:', error);
      setMessage('Failed to mint tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferTokens = async (e) => {
    e.preventDefault();
    
    if (!transferForm.from || !transferForm.to || !transferForm.amount) {
      setMessage('Please fill in all fields');
      return;
    }

    if (parseFloat(transferForm.amount) <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await transferToken(transferForm.from, transferForm.to, transferForm.amount);
      setMessage('Tokens transferred successfully!');
      
      // Add to history
      const newRecord = {
        type: 'transfer',
        timestamp: new Date().toLocaleString(),
        from: transferForm.from,
        to: transferForm.to,
        amount: transferForm.amount,
        result: result
      };
      setTokenHistory(prev => [newRecord, ...prev.slice(0, 9)]);
      
      // Reset form
      setTransferForm({ from: currentAddress, to: '', amount: '' });
      
      // Reload balance
      await loadTokenData();
      
      // Reset message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      setMessage('Failed to transfer tokens: ' + error.message);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Token Management</h1>

        {/* Token Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Token Balance</h3>
            <p className="text-3xl font-bold text-green-600">
              {tokenBalance ? tokenBalance.toString() : '0'} Tokens
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Wallet Address</h3>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-gray-900 truncate flex-1">
                {currentAddress || 'Not available'}
              </code>
              {currentAddress && (
                <button
                  onClick={() => copyToClipboard(currentAddress)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  📋
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Token Operations</h3>
            <p className="text-2xl font-bold text-blue-600">{tokenHistory.length}</p>
            <p className="text-sm text-gray-600">Total operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mint Tokens */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mint New Tokens</h2>
            
            <form onSubmit={handleMintTokens} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={mintForm.to}
                    onChange={(e) => setMintForm({...mintForm, to: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient address"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(mintForm.to)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={mintForm.amount}
                  onChange={(e) => setMintForm({...mintForm, amount: e.target.value})}
                  step="1"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount to mint"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Minting...' : 'Mint Tokens'}
              </button>
            </form>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Minting Information</h3>
              <p className="text-sm text-green-700">
                Minting creates new tokens and adds them to the specified address. 
                This operation increases the total token supply.
              </p>
            </div>
          </div>

          {/* Transfer Tokens */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transfer Tokens</h2>
            
            <form onSubmit={handleTransferTokens} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={transferForm.from}
                    onChange={(e) => setTransferForm({...transferForm, from: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sender address"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferForm.from)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Address
                </label>
                <input
                  type="text"
                  value={transferForm.to}
                  onChange={(e) => setTransferForm({...transferForm, to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                  step="1"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount to transfer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transferring...' : 'Transfer Tokens'}
              </button>
            </form>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Transfer Information</h3>
              <p className="text-sm text-blue-700">
                Transfer tokens from one address to another. The sender must have sufficient balance.
                This operation doesn't change the total token supply.
              </p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 px-4 py-3 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Token History */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Token Operation History</h2>
          
          {tokenHistory.length > 0 ? (
            <div className="space-y-3">
              {tokenHistory.map((record, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.type === 'mint' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">{record.timestamp}</span>
                      </div>
                      
                      {record.type === 'mint' ? (
                        <div className="text-sm">
                          <p><span className="text-gray-600">To:</span> <span className="font-mono">{record.to.substring(0, 20)}...</span></p>
                          <p><span className="text-gray-600">Amount:</span> <span className="font-semibold">{record.amount} tokens</span></p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p><span className="text-gray-600">From:</span> <span className="font-mono">{record.from.substring(0, 20)}...</span></p>
                          <p><span className="text-gray-600">To:</span> <span className="font-mono">{record.to.substring(0, 20)}...</span></p>
                          <p><span className="text-gray-600">Amount:</span> <span className="font-semibold">{record.amount} tokens</span></p>
                        </div>
                      )}
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
              <div className="text-gray-400 text-6xl mb-4">🪙</div>
              <p className="text-gray-500">No token operations yet</p>
              <p className="text-gray-400 text-sm mt-2">Mint or transfer tokens to see your history here</p>
            </div>
          )}
        </div>

        {/* Token Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Token Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">About This Token</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• ERC-20 compatible token standard</p>
                <p>• Supports minting and transfer operations</p>
                <p>• Built on the JestoGP9Te blockchain</p>
                <p>• Secure and decentralized token management</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">How to Use</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Mint tokens to create new supply</p>
                <p>• Transfer tokens between addresses</p>
                <p>• Check balances for any address</p>
                <p>• View operation history and transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokens;
