package com.loanguard.backend.dto;

import lombok.Data;

/**
 * 登录请求参数类
 */
@Data
public class LoginRequestDTO {
    private String userId; // 用户名（对应数据库的user_id字段）
    private String password; // 密码
}