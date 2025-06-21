// frontend/pages/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { createWallet, getWalletAddress, signData as signDataFunction, verifySignature } from '../src/api/wallet';
import { getTokenBalance } from '../src/api/token';
import { getAllTransactions } from '../src/api/blockchain';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signData, setSignData] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyData, setVerifyData] = useState({ publicKey: '', data: '', signature: '' });
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const address = await getWalletAddress();
      if (address) {
        setWallet({ address });
        
        // Load token balance
        try {
          const balance = await getTokenBalance(address);
          setTokenBalance(balance);
        } catch (error) {
          console.log('No token balance available');
        }

        // Load transactions
        try {
          const allTxs = await getAllTransactions();
          const walletTxs = allTxs.filter(tx => 
            tx.sender === address || tx.recipient === address
          );
          setTransactions(walletTxs);
        } catch (error) {
          console.log('No transactions available');
        }
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const newWallet = await createWallet();
      setWallet(newWallet);
      setLoading(false);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setLoading(false);
    }
  };

  const handleSignData = async () => {
    if (!signData.trim()) return;
    
    try {
      const signatureResult = await signDataFunction(signData);
      setSignature(signatureResult);
    } catch (error) {
      console.error('Error signing data:', error);
    }
  };

  const handleVerifySignature = async () => {
    if (!verifyData.publicKey || !verifyData.data || !verifyData.signature) return;
    
    try {
      const result = await verifySignature(
        verifyData.publicKey,
        verifyData.data,
        verifyData.signature
      );
      setVerifyResult(result);
    } catch (error) {
      console.error('Error verifying signature:', error);
      setVerifyResult(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Wallet Management</h1>

        {/* Create Wallet Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Wallet</h2>
          <button
            onClick={handleCreateWallet}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>

        {/* Wallet Details */}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Wallet Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Public Address</h3>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1 break-all">
                    {wallet.address}
                  </code>
                  <button
                    onClick={() => copyToClipboard(wallet.address)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Token Balance</h3>
                <div className="text-2xl font-bold text-green-600">
                  {tokenBalance ? tokenBalance.toString() : '0'} Tokens
                </div>
              </div>
            </div>

            {wallet.privateKey && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Private Key (Keep Secret!)</h3>
                <div className="flex items-center space-x-2">
                  <code className="bg-red-50 border border-red-200 px-3 py-2 rounded text-sm font-mono flex-1 break-all text-red-800">
                    {wallet.privateKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(wallet.privateKey)}
                    className="bg-red-100 hover:bg-red-200 px-3 py-2 rounded text-sm text-red-800"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Never share your private key with anyone!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Digital Signature Section */}
        {wallet && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Digital Signature</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sign Data */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Sign Data</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data to Sign
                    </label>
                    <textarea
                      value={signData}
                      onChange={(e) => setSignData(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter data to sign..."
                    />
                  </div>
                  <button
                    onClick={handleSignData}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Sign Data
                  </button>
                  {signature && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signature
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1 break-all">
                          {signature}
                        </code>
                        <button
                          onClick={() => copyToClipboard(signature)}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verify Signature */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Verify Signature</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Public Key
                    </label>
                    <input
                      type="text"
                      value={verifyData.publicKey}
                      onChange={(e) => setVerifyData({...verifyData, publicKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter public key..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <input
                      type="text"
                      value={verifyData.data}
                      onChange={(e) => setVerifyData({...verifyData, data: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter original data..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Signature
                    </label>
                    <input
                      type="text"
                      value={verifyData.signature}
                      onChange={(e) => setVerifyData({...verifyData, signature: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter signature..."
                    />
                  </div>
                  <button
                    onClick={handleVerifySignature}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Verify Signature
                  </button>
                  {verifyResult !== null && (
                    <div className={`px-3 py-2 rounded-md ${verifyResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {verifyResult ? '✅ Signature is valid!' : '❌ Signature is invalid!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {wallet && transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.sender === wallet.address 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tx.sender === wallet.address ? 'Sent' : 'Received'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {tx.sender.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {tx.recipient.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
