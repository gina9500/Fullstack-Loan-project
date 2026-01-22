package com.loanguard.backend.utils;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

/*
 * Swagger接口文档
 */
@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("贷款风险评估管理系统")
                                                .description("贷款风险评估系统的API文档")
                                                .contact(new Contact()
                                                                .name("testuser")
                                                                .url("xxxxxxxx")))
                                .externalDocs(new io.swagger.v3.oas.models.ExternalDocumentation()
                                                .description("更多详细信息")
                                                .url("https://example.com/xxxxxxx"))
                                .servers(List.of(
                                                new Server().url("http://localhost:8080").description("serverUrl")));
        }
}