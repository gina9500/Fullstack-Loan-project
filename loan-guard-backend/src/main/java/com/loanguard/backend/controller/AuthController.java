package com.loanguard.backend.controller;

import com.loanguard.backend.common.ResponseResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * 轻量级 Token 有效性校验接口
     * 用于前端定时心跳检测是否被踢下线
     */
    @GetMapping("/validate-token")
    public ResponseResult<?> validateToken() {
        // JwtInterceptor 已确保只有有效 token 才能进入此方法
        return ResponseResult.success("Token valid");
    }
}