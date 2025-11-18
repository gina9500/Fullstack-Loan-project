package com.loanguard.backend.model;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String createTime;
    private String updateTime;
}
