// frontend/pages/Transaction.jsx
import React, { useState } from "react";
import { createTransaction } from "../api/transaction";

const Transaction = () => {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const txData = { sender, recipient, amount: parseFloat(amount) };
      const res = await createTransaction(txData);
      setMessage("✅ Transaction submitted: " + res.status);
      setSender("");
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Transaction failed.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">💸 Send Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Sender Address"
          className="w-full border px-4 py-2 rounded"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Recipient Address"
          className="w-full border px-4 py-2 rounded"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full border px-4 py-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
        >
          Send
        </button>
      </form>

      {message && <div className="mt-4 text-sm">{message}</div>}
    </div>
  );
};

export default Transaction;
