package com.jestogp9te.blockchain;

import java.security.*;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Wallet {

    private static final Logger logger = LoggerFactory.getLogger(Wallet.class);
    private PrivateKey privateKey;
    private PublicKey publicKey;
    private String address;

    public Wallet() {
        // Don't generate keys in constructor - let it be done explicitly
        logger.debug("Wallet instance created");
    }

    // Generate a new public/private key pair using Elliptic Curve cryptography
    public void generateKeyPair() {
        logger.debug("Starting key pair generation...");
        try {
            logger.debug("Creating KeyPairGenerator for EC...");
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
            logger.debug("Creating SecureRandom instance...");
            SecureRandom random = SecureRandom.getInstanceStrong();
            logger.debug("Initializing KeyPairGenerator with 256 bits...");
            keyGen.initialize(256, random);
            logger.debug("Generating key pair...");
            KeyPair keyPair = keyGen.generateKeyPair();

            logger.debug("Extracting private and public keys...");
            this.privateKey = keyPair.getPrivate();
            this.publicKey = keyPair.getPublic();
            logger.debug("Generating address from public key...");
            this.address = getPublicKeyString();
            logger.info("Key pair generated successfully");
        } catch (Exception e) {
            logger.error("Failed to generate key pair: ", e);
            throw new WalletException("Failed to generate key pair", e);
        }
    }

    // Sign data with the private key and return the signature bytes
    public byte[] signData(byte[] data) {
        try {
            Signature ecdsaSign = Signature.getInstance("SHA256withECDSA");
            ecdsaSign.initSign(privateKey);
            ecdsaSign.update(data);
            return ecdsaSign.sign();
        } catch (Exception e) {
            throw new WalletException("Failed to sign data", e);
        }
    }

    // Verify signature of data using the public key
    public boolean verifySignature(byte[] data, byte[] signature) {
        try {
            Signature ecdsaVerify = Signature.getInstance("SHA256withECDSA");
            ecdsaVerify.initVerify(publicKey);
            ecdsaVerify.update(data);
            return ecdsaVerify.verify(signature);
        } catch (Exception e) {
            throw new WalletException("Failed to verify signature", e);
        }
    }

    // Return Base64-encoded public key string (can be used as address)
    public String getPublicKeyString() {
        if (publicKey == null) {
            throw new WalletException("Public key not generated yet");
        }
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    public String getPrivateKeyString() {
        if (privateKey == null) {
            throw new WalletException("Private key not generated yet");
        }
        return Base64.getEncoder().encodeToString(privateKey.getEncoded());
    }

    // Getters for JSON serialization
    public String getAddress() {
        if (address == null) {
            throw new WalletException("Wallet address not generated yet");
        }
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPublicKey() {
        return getPublicKeyString();
    }

    public void setPublicKey(String publicKey) {
        // This is a setter for JSON deserialization, but we don't actually use it
    }

    public String getPrivateKey() {
        return getPrivateKeyString();
    }

    public void setPrivateKey(String privateKey) {
        // This is a setter for JSON deserialization, but we don't actually use it
    }

    // Internal getters for the actual key objects
    public PrivateKey getPrivateKeyObject() {
        if (privateKey == null) {
            throw new WalletException("Private key not generated yet");
        }
        return privateKey;
    }

    public PublicKey getPublicKeyObject() {
        if (publicKey == null) {
            throw new WalletException("Public key not generated yet");
        }
        return publicKey;
    }
}
