package com.jestogp9te.api;

import com.jestogp9te.blockchain.Wallet;
import com.jestogp9te.blockchain.WalletException;
import com.jestogp9te.util.WalletUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);
    private Wallet wallet = new Wallet();

    @GetMapping("/new")
    public ResponseEntity<?> createWallet() {
        logger.info("Creating new wallet...");
        try {
            logger.debug("Generating key pair...");
            wallet.generateKeyPair();
            logger.debug("Key pair generated successfully");

            Map<String, String> response = new HashMap<>();
            response.put("address", wallet.getAddress());
            response.put("privateKey", wallet.getPrivateKey());
            response.put("publicKey", wallet.getPublicKey());

            logger.info("Wallet created successfully with address: {}", wallet.getAddress());
            return ResponseEntity.ok(response);
        } catch (WalletException e) {
            logger.error("WalletException during wallet creation: ", e);
            return ResponseEntity.internalServerError()
                .body("Error creating wallet: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected exception during wallet creation: ", e);
            return ResponseEntity.internalServerError()
                .body("Unexpected error creating wallet: " + e.getMessage());
        }
    }

    @GetMapping("/address")
    public ResponseEntity<?> getAddress() {
        logger.info("Getting wallet address...");
        try {
            String address = wallet.getAddress();
            logger.info("Wallet address retrieved: {}", address);
            Map<String, String> response = new HashMap<>();
            response.put("address", address);
            return ResponseEntity.ok(response);
        } catch (WalletException e) {
            logger.warn("No wallet created yet: {}", e.getMessage());
            return ResponseEntity.status(404).body("No wallet created yet");
        } catch (Exception e) {
            logger.error("Error getting wallet address: ", e);
            return ResponseEntity.internalServerError()
                .body("Error getting wallet address: " + e.getMessage());
        }
    }

    @PostMapping("/sign")
    public ResponseEntity<?> sign(@RequestBody String data) {
        logger.info("Signing data...");
        try {
            String signature = WalletUtil.signData(wallet.getPrivateKeyObject(), data);
            logger.info("Data signed successfully");
            Map<String, String> response = new HashMap<>();
            response.put("signature", signature);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error signing data: ", e);
            return ResponseEntity.internalServerError()
                .body("Error signing data: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String publicKey, @RequestParam String data, @RequestParam String signature) {
        logger.info("Verifying signature...");
        try {
            boolean isValid = WalletUtil.verifySignature(publicKey, data, signature);
            logger.info("Signature verification result: {}", isValid);
            Map<String, Object> response = new HashMap<>();
            response.put("isValid", isValid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error verifying signature: ", e);
            return ResponseEntity.internalServerError()
                .body("Error verifying signature: " + e.getMessage());
        }
    }
}
