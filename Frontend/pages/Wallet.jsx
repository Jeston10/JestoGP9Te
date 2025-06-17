// frontend/pages/Wallet.jsx
import React, { useState } from "react";
import { createWallet, getWalletInfo } from "../api/wallet";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [addressInput, setAddressInput] = useState("");
  const [fetchedWallet, setFetchedWallet] = useState(null);

  const handleCreateWallet = async () => {
    try {
      const newWallet = await createWallet();
      setWallet(newWallet);
    } catch (error) {
      console.error("Failed to create wallet", error);
    }
  };

  const handleFetchWallet = async () => {
    try {
      const info = await getWalletInfo(addressInput);
      setFetchedWallet(info);
    } catch (error) {
      console.error("Failed to fetch wallet", error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">🪪 Wallet Dashboard</h1>

      <div className="space-y-2">
        <button
          onClick={handleCreateWallet}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create New Wallet
        </button>
        {wallet && (
          <div className="mt-2 text-sm bg-gray-100 p-2 rounded border border-gray-300">
            <div><strong>Address:</strong> {wallet.address}</div>
            <div><strong>Balance:</strong> {wallet.balance}</div>
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="space-y-2">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="Enter Wallet Address"
          className="border px-4 py-2 w-full md:w-1/2 rounded"
        />
        <button
          onClick={handleFetchWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Fetch Wallet Info
        </button>
        {fetchedWallet && (
          <div className="mt-2 text-sm bg-gray-100 p-2 rounded border border-gray-300">
            <div><strong>Address:</strong> {fetchedWallet.address}</div>
            <div><strong>Balance:</strong> {fetchedWallet.balance}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
