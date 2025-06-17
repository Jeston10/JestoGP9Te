// frontend/pages/Token.jsx
import React, { useState } from "react";
import { issueToken, getTokenInfo } from "../api/token";

const Tokens = () => {
  const [issuer, setIssuer] = useState("");
  const [name, setName] = useState("");
  const [supply, setSupply] = useState("");
  const [issuedToken, setIssuedToken] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [fetchedToken, setFetchedToken] = useState(null);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const result = await issueToken({ issuer, name, supply: parseInt(supply) });
      setIssuedToken(result);
      setFetchedToken(null);
    } catch (err) {
      console.error("Issue failed:", err);
    }
  };

  const handleFetch = async () => {
    try {
      const result = await getTokenInfo(tokenId);
      setFetchedToken(result);
      setIssuedToken(null);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">🪙 Token Manager</h1>

      <form onSubmit={handleIssue} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Issuer Address"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Token Supply"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Issue Token
        </button>
      </form>

      {issuedToken && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <strong>✅ Token Issued:</strong>
          <div><strong>Token ID:</strong> {issuedToken.tokenId}</div>
          <div><strong>Name:</strong> {issuedToken.name}</div>
          <div><strong>Issuer:</strong> {issuedToken.issuer}</div>
          <div><strong>Supply:</strong> {issuedToken.supply}</div>
        </div>
      )}

      <hr className="my-4" />

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="border px-4 py-2 w-full md:w-1/2 rounded"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Fetch Token Info
        </button>
      </div>

      {fetchedToken && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <strong>🔍 Token Found:</strong>
          <div><strong>Token ID:</strong> {fetchedToken.tokenId}</div>
          <div><strong>Name:</strong> {fetchedToken.name}</div>
          <div><strong>Issuer:</strong> {fetchedToken.issuer}</div>
          <div><strong>Supply:</strong> {fetchedToken.supply}</div>
        </div>
      )}
    </div>
  );
};

export default Tokens;
