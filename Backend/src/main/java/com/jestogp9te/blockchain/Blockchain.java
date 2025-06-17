package com.jestogp9te.blockchain;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class Blockchain {

    private List<Block> chain;
    private List<Transaction> pendingTransactions;
    private int difficulty;

    // Public constructor (Spring will manage instantiation)
    public Blockchain() {
        chain = new ArrayList<>();
        pendingTransactions = new ArrayList<>();
        chain.add(createGenesisBlock());
        this.difficulty = 3;
    }

    private Block createGenesisBlock() {
        return new Block(0, new ArrayList<>(), "0");
    }

    public void addBlock(Block block) {
        block.mineBlock(difficulty);
        chain.add(block);
        pendingTransactions.clear();  // Clear mempool after mining
    }

    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    public boolean isValid() {
        for (int i = 1; i < chain.size(); i++) {
            Block prev = chain.get(i - 1);
            Block curr = chain.get(i);
            if (!curr.getPreviousHash().equals(prev.getHash()) ||
                !curr.getHash().equals(curr.calculateHash())) {
                return false;
            }
        }
        return true;
    }

    public List<Block> getChain() {
        return chain;
    }

    public void addTransaction(Transaction tx) {
        pendingTransactions.add(tx);
    }

    public List<Transaction> getPendingTransactions() {
        return new ArrayList<>(pendingTransactions);
    }
}
