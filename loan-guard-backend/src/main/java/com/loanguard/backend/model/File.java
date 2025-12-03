package com.loanguard.backend.model;

import lombok.Data;

/**
 * 文件实体类
 * 与数据库表file对应
 */
@Data
public class File {
    private Long id;
    private Long applicationId;
    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private String uploadTime;
}
