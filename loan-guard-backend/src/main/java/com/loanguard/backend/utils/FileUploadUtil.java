package com.loanguard.backend.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileUploadUtil {

    // 直接使用硬编码的上传路径，不依赖配置文件
    private static final String UPLOAD_DIR = "C:\\uploads\\financial_files";

    /**
     * 保存上传的JSON文件
     */
    public String saveJsonFile(MultipartFile file) throws IOException {
        // 确保上传目录存在
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 验证文件类型
        if (!isValidJsonFile(file)) {
            throw new IllegalArgumentException("只支持JSON文件格式");
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // 保存文件
        Path filePath = Paths.get(UPLOAD_DIR, uniqueFilename);
        Files.write(filePath, file.getBytes());

        // 返回相对路径
        return "financial_files/" + uniqueFilename;
    }

    /**
     * 验证是否为JSON文件
     */
    private boolean isValidJsonFile(MultipartFile file) {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        return contentType != null &&
                (contentType.equals("application/json") ||
                        contentType.equals("text/json"))
                &&
                originalFilename != null &&
                originalFilename.toLowerCase().endsWith(".json");
    }
}