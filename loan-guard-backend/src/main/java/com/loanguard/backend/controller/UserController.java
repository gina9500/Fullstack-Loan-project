package com.loanguard.backend.controller;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loanguard.backend.common.MsgCode;
import com.loanguard.backend.common.ResponseResult;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.dto.LoginRequestDTO;
import com.loanguard.backend.model.User;
import com.loanguard.backend.service.UserService;

/**
 * 用户控制层
 */
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseResult<?> login(@RequestBody LoginRequestDTO loginRequest, HttpSession session) {

        logger.error("用户登录请求执行", loginRequest, session);

        try {
            // 获取用户输入的用户名和密码
            String userId = loginRequest.getUserId();
            String password = loginRequest.getPassword();

            // 参数校验，使用ErrorCode中的错误信息
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseResult.fail(MsgCode.USERNAME_EMPTY.getMessage());
            }
            if (password == null || password.isEmpty()) {
                return ResponseResult.fail(MsgCode.PASSWORD_EMPTY.getMessage());
            }

            // 调用验证方法
            User user = userService.auth(userId, password);

            // 保存用户信息到Session
            session.setAttribute("currentUser", user);
            session.setAttribute("userId", user.getUserId()); // 保存真实用户ID

            // 登录成功，返回用户信息
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("role", user.getRole());
            userInfo.put("userId", user.getUserId());

            logger.error("登录成功,返回用户信息: {}", userInfo);

            return ResponseResult.success(MsgCode.SUCCESS.getMessage(), userInfo);

        } catch (ServiceException e) {
            // 处理业务异常
            return ResponseResult.fail(e.getMessage());
        } catch (Exception e) {

            e.printStackTrace();
            // 处理其他异常
            return ResponseResult.fail(MsgCode.SYSTEM_ERROR.getMessage());
        }
    }
}