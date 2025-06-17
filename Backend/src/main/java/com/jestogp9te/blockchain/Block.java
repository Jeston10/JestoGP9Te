package com.jestogp9te.blockchain;

import com.jestogp9te.util.HashUtil;
import java.util.ArrayList;
import java.util.List;

public class Block {
    private int index;
    private long timestamp;
    private List<Transaction> transactions;
    private String previousHash;
    private String hash;
    private int nonce;

    public Block(int index, List<Transaction> transactions, String previousHash) {
    this.index = index;
    this.timestamp = System.currentTimeMillis();
    this.transactions = transactions != null ? new ArrayList<>(transactions) : new ArrayList<>();
    this.previousHash = previousHash;
    this.hash = calculateHash();
}

    public String calculateHash() {
        return HashUtil.sha256(index + Long.toString(timestamp) + transactions.toString() + previousHash + nonce);
    }

    public void mineBlock(int difficulty) {
    String prefix = "0".repeat(difficulty);
    if (calculateHash().length() < difficulty) {
        throw new IllegalArgumentException("Difficulty is too high for the hash length.");
    }
    while (true) {
        if (hash.substring(0, difficulty).equals(prefix)) {
            break;
        }
        nonce++;
        hash = calculateHash();
    }
}

    // Getters
    public String getHash() { return hash; }
    public String getPreviousHash() { return previousHash; }
    public List<Transaction> getTransactions() { return transactions; }
}
