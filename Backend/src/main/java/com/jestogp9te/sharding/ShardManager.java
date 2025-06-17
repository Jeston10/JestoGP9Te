package com.jestogp9te.sharding;

import com.jestogp9te.blockchain.Transaction;
import java.util.HashMap;
import java.util.Map;

public class ShardManager {
    private final Map<Integer, Shard> shardMap = new HashMap<>();
    private final int totalShards;

    public ShardManager(int totalShards) {
        this.totalShards = totalShards;
        for (int i = 0; i < totalShards; i++) {
            shardMap.put(i, new Shard(i));
        }
    }

    public void routeTransaction(Transaction tx) {
        int shardId = Math.abs(tx.getSender().hashCode()) % totalShards;
        shardMap.get(shardId).addTransaction(tx);
    }

    public Map<Integer, Shard> getShards() {
        return shardMap;
    }
}
