package com.loanguard.backend.utils;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/*
 * 获取登录用户ID帮助类
 */
@Component
public class SessionUtils {

    /**
     * 获取当前登录用户ID
     */
    public String getCurrentUserId() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            return (String) request.getAttribute("userId");
        }
        return null;
    }

    /**
     * 获取当前登录用户角色
     */
    public String getCurrentUserRole() {
        HttpServletRequest request = getRequest();
        if (request != null) {
            return (String) request.getAttribute("role");
        }
        return null;
    }

    /**
     * 获取Request对象
     */
    private HttpServletRequest getRequest() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if (requestAttributes != null) {
            return requestAttributes.getRequest();
        }
        return null;
    }
}