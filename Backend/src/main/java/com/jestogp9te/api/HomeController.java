// Source code is decompiled from a .class file using FernFlower decompiler.
package com.jestogp9te.api;

import com.jestogp9te.blockchain.Blockchain;
import com.jestogp9te.network.PeerNetwork;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HomeController {
    
    @Autowired
    private Blockchain blockchain;
    
    @Autowired
    private PeerNetwork peerNetwork;

    @GetMapping("/")
    public String home() {
        return "JestoGP9Te Blockchain API is running!";
    }
    
    @GetMapping("/health")
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("blockHeight", blockchain.getChain().size());
        health.put("pendingTransactions", blockchain.getPendingTransactions().size());
        health.put("peers", peerNetwork.getPeerAddresses().size());
        health.put("isValid", blockchain.isValid());
        return health;
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBlocks", blockchain.getChain().size());
        stats.put("totalTransactions", blockchain.getChain().stream()
            .mapToInt(block -> block.getTransactions().size())
            .sum());
        stats.put("pendingTransactions", blockchain.getPendingTransactions().size());
        stats.put("connectedPeers", peerNetwork.getPeerAddresses().size());
        return stats;
    }
}