package com.loanguard.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.baidu.aip.ocr.AipOcr;

/*
 * 配置类，用于加载百度OCR的配置信息
*/
@Configuration
@ConfigurationProperties(prefix = "baidu.ocr")
public class OcrConfig {

    private String appId;
    private String apiKey;
    private String secretKey;

    @Bean
    public AipOcr aipOcr() {
        // 初始化一个AipOcr
        AipOcr client = new AipOcr(appId, apiKey, secretKey);

        // 设置网络连接参数
        client.setConnectionTimeoutInMillis(5000);
        client.setSocketTimeoutInMillis(60000);

        return client;
    }

    // getter和setter
    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }
}