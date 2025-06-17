package com.jestogp9te.token;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    private final TokenContractProperties properties;

    public TokenService(TokenContractProperties properties) {
        this.properties = properties;
    }

    public void issueTokens() {
        logger.info("Issuing tokens with total supply: {}", properties.getTotalSupply());
        // your logic here
    }
}
