package org.example.gg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GgApplication {

    public static void main(String[] args) {
        SpringApplication.run(GgApplication.class, args);
    }

}


