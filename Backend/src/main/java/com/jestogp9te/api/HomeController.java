// Source code is decompiled from a .class file using FernFlower decompiler.
package com.jestogp9te.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "JestoGP9Te Blockchain API is running!";
    }
}