package com.jestogp9te.api;

import com.jestogp9te.blockchain.Block;
import com.jestogp9te.blockchain.Blockchain;
import com.jestogp9te.blockchain.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blockchain")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BlockchainController {

    @Autowired
    private Blockchain blockchain;

    @GetMapping("/chain")
    public List<Block> getChain() {
        return blockchain.getChain();
    }

    @GetMapping("/latest")
    public Block getLatestBlock() {
        return blockchain.getLatestBlock();
    }

    @GetMapping("/block/{index}")
    public Block getBlock(@PathVariable int index) {
        if (index >= 0 && index < blockchain.getChain().size()) {
            return blockchain.getChain().get(index);
        }
        throw new IllegalArgumentException("Block index out of range");
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return blockchain.getChain().stream()
                .flatMap(block -> block.getTransactions().stream())
                .toList();
    }

    @GetMapping("/isValid")
    public boolean isValid() {
        return blockchain.isValid();
    }

    @GetMapping("/length")
    public int getLength() {
        return blockchain.getChain().size();
    }
} 