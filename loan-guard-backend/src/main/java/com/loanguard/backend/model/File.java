package com.loanguard.backend.model;

import lombok.Data;

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
