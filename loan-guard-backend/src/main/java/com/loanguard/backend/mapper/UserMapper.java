package com.loanguard.backend.mapper;

import com.loanguard.backend.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User findByUsername(String username);

    User findById(Long id);

    int insert(User user);

    int update(User user);
}