package com.jestogp9te.blockchain;

import java.security.PublicKey;
import com.jestogp9te.util.HashUtil;

public class Transaction {
    private String sender;
    private String recipient;
    private double amount;
    private byte[] signature;

    public Transaction(String sender, String recipient, double amount) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
    }

    public String calculateHash() {
        return HashUtil.sha256(sender + recipient + amount);
    }

    public void setSignature(byte[] signature) {
        this.signature = signature;
    }

    public byte[] getSignature() {
        return signature;
    }

    public boolean verifySignature(PublicKey publicKey) {
        return com.jestogp9te.util.WalletUtil.verify(publicKey, calculateHash(), signature);
    }

    // Getters
    public String getSender() { return sender; }
    public String getRecipient() { return recipient; }
    public double getAmount() { return amount; }

    @Override
    public String toString() {
        return sender + "->" + recipient + ": " + amount;
    }
}
