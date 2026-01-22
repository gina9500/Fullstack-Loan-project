package com.loanguard.backend.config;

import com.loanguard.backend.common.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * Web配置类，用于配置拦截器等
*/
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 配置JWT拦截器
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**") // 拦截所有API请求
                .excludePathPatterns("/api/user/login"); // 排除用户登录接口
    }
}