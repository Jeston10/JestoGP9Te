package com.jestogp9te.token;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigInteger;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class TokenContract {
    private static final Logger logger = LoggerFactory.getLogger(TokenContract.class);

    private static final String NAME = "JestoToken";
    private static final String SYMBOL = "JST";
    private static final int DECIMALS = 18;

    private BigInteger totalSupply = BigInteger.ZERO;
    private final Map<String, BigInteger> balances = new ConcurrentHashMap<>();
    private final Map<String, Map<String, BigInteger>> allowances = new ConcurrentHashMap<>();

    public String getName() {
        return NAME;
    }

    public String getSymbol() {
        return SYMBOL;
    }

    public int getDecimals() {
        return DECIMALS;
    }

    public BigInteger getTotalSupply() {
        return totalSupply;
    }

    public BigInteger balanceOf(String address) {
        return balances.getOrDefault(address, BigInteger.ZERO);
    }

    public void mint(String to, BigInteger amount) {
        validateAddress(to);
        validateAmount(amount);

        totalSupply = totalSupply.add(amount);
        balances.put(to, balanceOf(to).add(amount));

        logger.info("Minted {} tokens to {}. Total supply is now {}", amount, to, totalSupply);
    }

    public void transfer(String from, String to, BigInteger amount) {
        validateAddress(from);
        validateAddress(to);
        validateAmount(amount);

        BigInteger senderBalance = balanceOf(from);
        if (senderBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        balances.put(from, senderBalance.subtract(amount));
        balances.put(to, balanceOf(to).add(amount));

        logger.info("Transferred {} tokens from {} to {}", amount, from, to);
    }

    public void approve(String owner, String spender, BigInteger amount) {
        validateAddress(owner);
        validateAddress(spender);
        validateAmount(amount);

        allowances.computeIfAbsent(owner, k -> new ConcurrentHashMap<>()).put(spender, amount);

        logger.info("{} approved {} to spend {} tokens", owner, spender, amount);
    }

    public BigInteger allowance(String owner, String spender) {
        return allowances.getOrDefault(owner, Map.of()).getOrDefault(spender, BigInteger.ZERO);
    }

    public void transferFrom(String spender, String from, String to, BigInteger amount) {
        validateAddress(spender);
        validateAddress(from);
        validateAddress(to);
        validateAmount(amount);

        BigInteger allowed = allowance(from, spender);
        if (allowed.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Allowance exceeded");
        }

        BigInteger fromBalance = balanceOf(from);
        if (fromBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        allowances.get(from).put(spender, allowed.subtract(amount));
        balances.put(from, fromBalance.subtract(amount));
        balances.put(to, balanceOf(to).add(amount));

        logger.info("{} transferred {} tokens from {} to {}", spender, amount, from, to);
    }

    // Helper validation methods
    private void validateAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address must not be null or empty");
        }
    }

    private void validateAmount(BigInteger amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be positive and not null");
        }
    }
}
