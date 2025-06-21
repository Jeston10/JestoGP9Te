package com.jestogp9te.api;

import com.jestogp9te.token.TokenContract;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@RestController
@RequestMapping("/token")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TokenController {

    private final TokenContract tokenContract = new TokenContract();

    @GetMapping("/balance")
    public BigInteger getBalance(@RequestParam String address) {
        return tokenContract.balanceOf(address);
    }

    @PostMapping("/mint")
    public String mintToken(@RequestParam String to, @RequestParam BigInteger amount) {
        tokenContract.mint(to, amount);
        return "Tokens minted";
    }

    @PostMapping("/transfer")
    public String transferToken(@RequestParam String from, @RequestParam String to, @RequestParam BigInteger amount) {
        try {
            tokenContract.transfer(from, to, amount);
            return "Transfer successful";
        } catch (IllegalArgumentException e) {
            return "Transfer failed: " + e.getMessage();
        }
    }
}
