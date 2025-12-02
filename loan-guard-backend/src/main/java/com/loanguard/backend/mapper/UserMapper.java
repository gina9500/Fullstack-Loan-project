package com.loanguard.backend.mapper;

import com.loanguard.backend.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User findByUserId(String userId);
}