package com.loanguard.backend.mapper;

import com.loanguard.backend.model.File;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper {

    /**
     * 插入文件记录
     * 
     * @param file 文件信息
     * @return 影响行数
     */
    int insert(File file);
}