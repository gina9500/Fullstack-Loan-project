package com.loanguard.backend.utils;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpSession;
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
        HttpSession session = getSession();
        if (session != null) {
            return (String) session.getAttribute("userId");
        }
        return null;
    }

    /**
     * 获取Session对象
     */
    private HttpSession getSession() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if (requestAttributes != null) {
            return requestAttributes.getRequest().getSession();
        }
        return null;
    }

}