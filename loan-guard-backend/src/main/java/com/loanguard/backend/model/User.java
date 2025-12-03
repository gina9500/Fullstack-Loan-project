package com.loanguard.backend.model;

import org.apache.ibatis.type.Alias;
import lombok.Data;

/**
 * 用户实体类
 * 与数据库表user对应
 */
@Data
@Alias("User")
public class User {
    private Long id; // 主键ID
    private String userId; // 用户名（对应数据库的user_id字段）
    private String password; // 密码
    private String role; // 角色，默认为corporation
    private String createTime; // 创建时间
    private String updateTime; // 更新时间
}