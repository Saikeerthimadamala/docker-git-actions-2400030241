package com.klef.soa.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FarmersCooperativeSpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmersCooperativeSpringBootApplication.class, args);
        System.out.println("Project is Running ...!!!");
    }
}