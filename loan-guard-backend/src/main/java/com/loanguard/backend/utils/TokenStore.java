package com.loanguard.backend.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * TokenStore用于管理用户的当前有效Token，实现单点登录功能
 */
@Component
public class TokenStore {
    // 使用ConcurrentHashMap保证线程安全
    private final Map<String, String> userTokenMap = new ConcurrentHashMap<>();

    /**
     * 保存用户的当前有效Token
     * 
     * @param userId 用户ID
     * @param token  新生成的Token
     */
    public void saveToken(String userId, String token) {
        userTokenMap.put(userId, token);
    }

    /**
     * 获取用户的当前有效Token
     * 
     * @param userId 用户ID
     * @return 当前有效Token，如果用户未登录则返回null
     */
    public String getToken(String userId) {
        return userTokenMap.get(userId);
    }

    /**
     * 验证Token是否为用户的当前有效Token
     * 
     * @param userId 用户ID
     * @param token  要验证的Token
     * @return 如果是当前有效Token则返回true，否则返回false
     */
    public boolean validateToken(String userId, String token) {
        String currentToken = userTokenMap.get(userId);
        return currentToken != null && currentToken.equals(token);
    }

    /**
     * 删除用户的Token（用户登出时调用）
     * 
     * @param userId 用户ID
     */
    public void removeToken(String userId) {
        userTokenMap.remove(userId);
    }
}