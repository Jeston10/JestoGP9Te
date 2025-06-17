package com.jestogp9te.blockchain;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class Miner {

    private final Blockchain blockchain;

    public Miner(Blockchain blockchain) {
        this.blockchain = blockchain;
    }

    // Mine a new block with given transactions and add it to the blockchain
    public Block mine(List<Transaction> transactions) {
        Block newBlock = new Block(
            blockchain.getChain().size(),           // block index
            transactions,                           // list of transactions
            blockchain.getLatestBlock().getHash()  // previous block hash
        );

        blockchain.addBlock(newBlock); // this includes mining (proof of work)
        return newBlock;
    }
}
