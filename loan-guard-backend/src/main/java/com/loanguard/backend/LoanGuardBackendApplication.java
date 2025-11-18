package com.loanguard.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.loanguard.backend.mapper")
public class LoanGuardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoanGuardBackendApplication.class, args);
	}

}
