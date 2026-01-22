package com.loanguard.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.loanguard.backend.config.JwtProperties;

@SpringBootApplication(scanBasePackages = { "com.loanguard.backend" })
@MapperScan("com.loanguard.backend.mapper")
@EnableConfigurationProperties(JwtProperties.class) // 启用JwtProperties配置类
public class LoanGuardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoanGuardBackendApplication.class, args);
	}

	// 配置CORS跨域
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true)
						.maxAge(3600);
			}
		};
	}

}
