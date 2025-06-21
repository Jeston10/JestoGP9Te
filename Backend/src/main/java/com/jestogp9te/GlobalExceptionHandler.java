package com.jestogp9te;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex) {
        logger.error("Unhandled exception occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Internal server error: " + ex.getMessage());
    }
    
    @ExceptionHandler(com.jestogp9te.blockchain.WalletException.class)
    public ResponseEntity<String> handleWalletException(com.jestogp9te.blockchain.WalletException ex) {
        logger.error("Wallet exception occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Wallet error: " + ex.getMessage());
    }
    
    @ExceptionHandler(com.jestogp9te.util.WalletUtilException.class)
    public ResponseEntity<String> handleWalletUtilException(com.jestogp9te.util.WalletUtilException ex) {
        logger.error("Wallet utility exception occurred: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Wallet utility error: " + ex.getMessage());
    }
} 