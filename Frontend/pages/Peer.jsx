// frontend/pages/Peer.jsx
import React, { useEffect, useState } from "react";
import { getPeers, addPeer } from "../api/peer";

const Peer = () => {
  const [peers, setPeers] = useState([]);
  const [newPeer, setNewPeer] = useState("");
  const [message, setMessage] = useState("");

  const fetchPeers = async () => {
    try {
      const data = await getPeers();
      setPeers(data);
    } catch (err) {
      console.error("Failed to fetch peers:", err);
    }
  };

  const handleAddPeer = async () => {
    try {
      const res = await addPeer({ peerUrl: newPeer });
      setMessage("✅ Peer added: " + res.status);
      setNewPeer("");
      fetchPeers(); // refresh peer list
    } catch (err) {
      console.error("Add peer failed:", err);
      setMessage("❌ Failed to add peer.");
    }
  };

  useEffect(() => {
    fetchPeers();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">🌐 Peer Manager</h1>

      <div className="space-y-2 max-w-md">
        <input
          type="text"
          placeholder="http://localhost:5001"
          value={newPeer}
          onChange={(e) => setNewPeer(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          onClick={handleAddPeer}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Add Peer
        </button>
      </div>

      {message && <div className="text-sm mt-2">{message}</div>}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">🧑‍🤝‍🧑 Connected Peers</h2>
        <ul className="list-disc list-inside space-y-1">
          {peers.map((peer, idx) => (
            <li key={idx}>{peer}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Peer;
