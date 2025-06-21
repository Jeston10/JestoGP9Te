// frontend/pages/Peer.jsx
import React, { useState, useEffect } from 'react';
import { getPeers, addPeer } from '../src/api/peer';

const Peer = () => {
  const [peers, setPeers] = useState([]);
  const [newPeerAddress, setNewPeerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [peerStatus, setPeerStatus] = useState({});

  useEffect(() => {
    loadPeers();
    const interval = setInterval(loadPeers, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPeers = async () => {
    try {
      const peersData = await getPeers();
      setPeers(peersData);
      
      // Check peer status (this would typically ping each peer)
      const status = {};
      peersData.forEach(peer => {
        status[peer] = 'online'; // Simplified - in real app you'd ping each peer
      });
      setPeerStatus(status);
    } catch (error) {
      console.error('Error loading peers:', error);
    }
  };

  const handleAddPeer = async (e) => {
    e.preventDefault();
    
    if (!newPeerAddress.trim()) {
      setMessage('Please enter a peer address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await addPeer(newPeerAddress);
      setMessage('Peer added successfully!');
      setNewPeerAddress('');
      
      // Reload peers
      await loadPeers();
      
      // Reset message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding peer:', error);
      setMessage('Failed to add peer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getPeerStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Peer Network Management</h1>

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Connected Peers</h3>
            <p className="text-3xl font-bold text-blue-600">{peers.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Online Peers</h3>
            <p className="text-3xl font-bold text-green-600">
              {Object.values(peerStatus).filter(status => status === 'online').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Network Status</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-lg font-bold text-green-600">Healthy</span>
            </div>
          </div>
        </div>

        {/* Add Peer Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Peer</h2>
          
          <form onSubmit={handleAddPeer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peer Address
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPeerAddress}
                  onChange={(e) => setNewPeerAddress(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter peer address (e.g., http://localhost:8081)"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Peer'}
                </button>
              </div>
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
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Peer Address Format</h3>
            <p className="text-sm text-blue-700">
              Enter the full URL of the peer node you want to connect to. 
              Example: <code className="bg-blue-100 px-1 rounded">http://localhost:8081</code>
            </p>
          </div>
        </div>

        {/* Peer List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connected Peers</h2>
          
          {peers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {peers.map((peer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900">
                            {peer}
                          </span>
                          <button
                            onClick={() => copyToClipboard(peer)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPeerStatusColor(peerStatus[peer])}`}>
                          {peerStatus[peer] || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(peer, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Visit
                          </button>
                          <button
                            onClick={() => copyToClipboard(peer)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🌐</div>
              <p className="text-gray-500 text-lg">No peers connected</p>
              <p className="text-gray-400 text-sm mt-2">Add a peer to start building your network</p>
            </div>
          )}
        </div>

        {/* Network Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Network Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">How P2P Works</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Peers communicate directly without central servers</p>
                <p>• Each peer maintains a copy of the blockchain</p>
                <p>• New blocks and transactions are broadcast to all peers</p>
                <p>• Network consensus ensures data integrity</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Connection Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Ensure the peer node is running and accessible</p>
                <p>• Use the correct protocol (http/https)</p>
                <p>• Include the port number if not using default</p>
                <p>• Check firewall settings for network connectivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peer;
