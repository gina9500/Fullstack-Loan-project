package com.loanguard.backend.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanguard.backend.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/*
    * JWT拦截器，用于验证请求中的JWT Token
*/
@Component
public class JwtInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(JwtInterceptor.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        logger.info("处理请求: {}", request.getRequestURL());

        // 放行OPTIONS预检请求
        if ("OPTIONS".equals(request.getMethod())) {
            logger.info("放行OPTIONS预检请求");
            return true;
        }

        // 从请求头中获取Token
        String token = request.getHeader("Authorization");
        logger.info("获取到的Authorization头: {}", token);

        // 检查Token是否存在
        if (token == null || !token.startsWith("Bearer ")) {
            logger.warn("Token不存在或格式错误");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            ResponseResult<?> result = ResponseResult.fail(MsgCode.TOKEN_MISSING.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));
            return false;
        }

        // 提取Token
        token = token.substring(7);
        logger.info("提取后的Token: {}", token);

        // 验证Token
        if (!jwtUtils.validateToken(token)) {
            logger.warn("Token无效或已过期");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            ResponseResult<?> result = ResponseResult.fail(MsgCode.TOKEN_INVALID.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));
            return false;
        }

        // 将用户ID和角色设置到请求属性中
        String userId = jwtUtils.getUserIdFromToken(token);
        String role = jwtUtils.getRoleFromToken(token);
        logger.info("Token验证成功，用户ID: {}, 角色: {}", userId, role);

        request.setAttribute("userId", userId);
        request.setAttribute("role", role);

        return true;
    }
}