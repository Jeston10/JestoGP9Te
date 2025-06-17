package com.jestogp9te.api;

import com.jestogp9te.blockchain.Blockchain;
import com.jestogp9te.blockchain.Transaction;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final Blockchain blockchain;

    public TransactionController(Blockchain blockchain) {
        this.blockchain = blockchain;
    }

    @PostMapping("/new")
    public String createTransaction(@RequestBody Transaction transaction) {
        blockchain.addTransaction(transaction); // returns void
        return "Transaction added";
    }

    @GetMapping("/pending")
    public List<Transaction> getPendingTransactions() {
        return blockchain.getPendingTransactions();
    }
}
