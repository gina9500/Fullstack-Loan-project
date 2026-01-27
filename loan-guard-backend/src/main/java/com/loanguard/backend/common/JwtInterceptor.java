package com.loanguard.backend.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanguard.backend.utils.JwtUtils;
import com.loanguard.backend.utils.TokenStore;

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

    @Autowired
    private TokenStore tokenStore;

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
        logger.info("开始验证Token有效性");
        if (!jwtUtils.validateToken(token)) {
            logger.warn("Token无效或已过期");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            ResponseResult<?> result = ResponseResult.fail(MsgCode.TOKEN_INVALID.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));
            return false;
        }
        logger.info("Token有效性验证通过");

        // 检查Token是否为当前有效Token（单点登录验证）
        logger.info("开始执行单点登录验证");
        String userId = jwtUtils.getUserIdFromToken(token);
        logger.info("从Token中获取的用户ID: {}", userId);

        // 检查TokenStore中是否存在该用户的Token
        String currentTokenInStore = tokenStore.getToken(userId);
        logger.info("TokenStore中用户{}的当前Token: {}", userId, currentTokenInStore);

        if (!tokenStore.validateToken(userId, token)) {
            logger.warn("用户{}已在其他地方登录，当前Token无效", userId);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            ResponseResult<?> result = ResponseResult.fail(MsgCode.TOKEN_EXPIRED_BY_OTHER_LOGIN.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));
            return false;
        }
        logger.info("单点登录验证通过");

        // 将用户ID和角色设置到请求属性中
        String role = jwtUtils.getRoleFromToken(token);
        logger.info("Token验证成功，用户ID: {}, 角色: {}", userId, role);

        request.setAttribute("userId", userId);
        request.setAttribute("role", role);

        return true;
    }
}