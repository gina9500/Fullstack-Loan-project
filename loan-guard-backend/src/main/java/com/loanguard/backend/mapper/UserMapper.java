package com.loanguard.backend.mapper;

import com.loanguard.backend.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    /**
     * 根据用户ID查询用户
     * 
     * @param userId 用户ID
     * @return 用户对象
     */
    User findByUserId(String userId);
}