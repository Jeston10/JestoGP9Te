package com.jestogp9te.api;

import com.jestogp9te.blockchain.Wallet;
import com.jestogp9te.util.WalletUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private Wallet wallet = new Wallet();

    @GetMapping("/new")
    public Wallet createWallet() {
        wallet.generateKeyPair();
        return wallet;
    }

    @GetMapping("/address")
    public String getAddress() {
        return wallet.getPublicKeyString(); // fixed here
    }

    @PostMapping("/sign")
    public String sign(@RequestBody String data) {
        return WalletUtil.signData(wallet.getPrivateKey(), data); // fixed here
    }

    @PostMapping("/verify")
    public boolean verify(@RequestParam String publicKey, @RequestParam String data, @RequestParam String signature) {
        return WalletUtil.verifySignature(publicKey, data, signature); // fixed here
    }
}
