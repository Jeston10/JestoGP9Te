package com.jestogp9te.blockchain;

import java.security.*;
import java.util.Base64;

public class Wallet {

    private PrivateKey privateKey;
    private PublicKey publicKey;

    public Wallet() {
        generateKeyPair();
    }

    // Generate a new public/private key pair using Elliptic Curve cryptography
    public void generateKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
            SecureRandom random = SecureRandom.getInstanceStrong();
            keyGen.initialize(256, random);
            KeyPair keyPair = keyGen.generateKeyPair();

            this.privateKey = keyPair.getPrivate();
            this.publicKey = keyPair.getPublic();
        } catch (Exception e) {
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
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
}
