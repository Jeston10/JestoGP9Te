package com.jestogp9te.api;

import com.jestogp9te.blockchain.Blockchain;
import com.jestogp9te.blockchain.Miner;
import com.jestogp9te.blockchain.Transaction;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mining")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MiningController {

    private final Blockchain blockchain;
    private final Miner miner;

    public MiningController(Blockchain blockchain, Miner miner) {
        this.blockchain = blockchain;
        this.miner = miner;
    }

    @PostMapping("/mine")
    public String mineBlock() {
        List<Transaction> pendingTxs = blockchain.getPendingTransactions();
        if (pendingTxs.isEmpty()) {
            return "No transactions to mine";
        }
        miner.mine(pendingTxs);
        return "Block mined successfully";
    }
}
