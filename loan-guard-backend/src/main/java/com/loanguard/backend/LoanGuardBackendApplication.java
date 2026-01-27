package com.loanguard.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.loanguard.backend.config.JwtProperties;

@SpringBootApplication(scanBasePackages = { "com.loanguard.backend" })
@MapperScan("com.loanguard.backend.mapper")
@EnableConfigurationProperties(JwtProperties.class) // 启用JwtProperties配置类
public class LoanGuardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoanGuardBackendApplication.class, args);
	}

}
