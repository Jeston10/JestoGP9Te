package com.jestogp9te.util;

import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class WalletUtil {

    // Private constructor to prevent instantiation
    private WalletUtil() {
        throw new UnsupportedOperationException("WalletUtil is a utility class and cannot be instantiated");
    }

    public static KeyPair generateKeyPair() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
            generator.initialize(256);
            return generator.generateKeyPair();
        } catch (Exception e) {
            throw new WalletUtilException("Key pair generation failed", e);
        }
    }

    public static String getStringFromKey(Key key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    public static byte[] sign(PrivateKey privateKey, String data) {
        try {
            Signature dsa = Signature.getInstance("SHA256withECDSA");
            dsa.initSign(privateKey);
            dsa.update(data.getBytes());
            return dsa.sign();
        } catch (Exception e) {
            throw new WalletUtilException("Error signing data", e);
        }
    }

    public static String signData(PrivateKey privateKey, String data) {
        byte[] signature = sign(privateKey, data);
        return Base64.getEncoder().encodeToString(signature);
    }

    public static boolean verify(PublicKey publicKey, String data, byte[] signature) {
        try {
            Signature sig = Signature.getInstance("SHA256withECDSA");
            sig.initVerify(publicKey);
            sig.update(data.getBytes());
            return sig.verify(signature);
        } catch (Exception e) {
            throw new WalletUtilException("Signature verification failed", e);
        }
    }

    public static boolean verifySignature(String base64PublicKey, String data, String base64Signature) {
        try {
            byte[] publicKeyBytes = Base64.getDecoder().decode(base64PublicKey);
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(publicKeyBytes);
            PublicKey publicKey = keyFactory.generatePublic(pubKeySpec);

            byte[] signatureBytes = Base64.getDecoder().decode(base64Signature);

            return verify(publicKey, data, signatureBytes);
        } catch (Exception e) {
            throw new WalletUtilException("Error verifying signature", e);
        }
    }
}
