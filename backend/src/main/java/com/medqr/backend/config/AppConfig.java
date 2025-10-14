package com.medqr.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${app.name:MedQR}")
    private String appName;

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getAppName() {
        return appName;
    }
}