package com.finanfuture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinanfutureApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinanfutureApplication.class, args);
        System.out.println("🚀 FinanFuture API rodando em http://localhost:8080");
    }
}