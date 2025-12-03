package com.loanguard.backend.service;

import com.loanguard.backend.common.ErrorCode;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.model.User;
import com.loanguard.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    /**
     * 用户验证
     * 
     * @param userId   用户名
     * @param password 密码
     * @return 验证成功返回用户信息
     * @throws ServiceException 当验证失败时抛出异常
     */
    public User auth(String userId, String password) {
        // 根据用户名查找用户
        User user = userMapper.findByUserId(userId);

        // 判断用户是否存在
        if (user == null) {
            throw new ServiceException(ErrorCode.USER_NOT_EXIST.getMessage(), ErrorCode.USER_NOT_EXIST.getCode());
        }

        // 判断密码是否正确
        if (!user.getPassword().equals(password)) {
            throw new ServiceException(ErrorCode.PASSWORD_ERROR.getMessage(), ErrorCode.PASSWORD_ERROR.getCode());
        }

        return user;
    }
}