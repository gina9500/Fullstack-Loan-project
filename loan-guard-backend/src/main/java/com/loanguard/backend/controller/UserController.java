package com.loanguard.backend.controller;

import com.loanguard.backend.common.ErrorCode;
import com.loanguard.backend.common.ResponseResult;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.dto.LoginRequestDTO;
import com.loanguard.backend.model.User;
import com.loanguard.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseResult<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // 获取用户输入的用户名和密码
            String userId = loginRequest.getUserId();
            String password = loginRequest.getPassword();

            // 参数校验，使用ErrorCode中的错误信息
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseResult.fail(ErrorCode.USERNAME_EMPTY.getMessage());
            }
            if (password == null || password.isEmpty()) {
                return ResponseResult.fail(ErrorCode.PASSWORD_EMPTY.getMessage());
            }

            // 调用验证方法，处理可能的ServiceException
            User user = userService.auth(userId, password);

            // 登录成功，返回用户角色信息
            return ResponseResult.success("登录成功", user.getRole());
        } catch (ServiceException e) {
            // 处理业务异常
            return ResponseResult.fail(e.getMessage());
        } catch (Exception e) {
            // 记录异常日志
            e.printStackTrace();
            // 处理其他异常
            return ResponseResult.fail(ErrorCode.SYSTEM_ERROR.getMessage());
        }
    }
}