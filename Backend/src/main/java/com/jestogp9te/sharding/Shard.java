package com.jestogp9te.sharding;

import com.jestogp9te.blockchain.Transaction;
import java.util.ArrayList;
import java.util.List;

public class Shard {
    private final int shardId;
    private final List<Transaction> transactions;

    public Shard(int shardId) {
        this.shardId = shardId;
        this.transactions = new ArrayList<>();
    }

    public int getShardId() {
        return shardId;
    }

    public void addTransaction(Transaction tx) {
        transactions.add(tx);
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    @Override
    public String toString() {
        return "Shard{id=" + shardId + ", txCount=" + transactions.size() + "}";
    }
}
