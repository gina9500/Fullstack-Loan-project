package com.loanguard.backend.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/*
 * 文件上传帮助类
 */
@Component
public class FileUploadUtil {

    // 财务数据文件的上传路径
    private static final String FINANCIAL_DIR = "C:\\uploads\\financial_files";
    // 身份证图片的上传路径
    private static final String ID_CARD_DIR = "C:\\uploads\\id_card_images";

    /**
     * 保存上传的JSON文件
     */
    public String saveJsonFile(MultipartFile file) throws IOException {
        // 确保上传目录存在
        File directory = new File(FINANCIAL_DIR);
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
        Path filePath = Paths.get(FINANCIAL_DIR, uniqueFilename);
        Files.write(filePath, file.getBytes());

        // 返回相对路径
        return "financial_files/" + uniqueFilename;
    }

    /**
     * 保存身份证图片
     */
    public String saveIdCardImage(MultipartFile file) throws IOException {
        // 确保上传目录存在
        File directory = new File(ID_CARD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 验证文件类型
        if (!isValidImageFile(file)) {
            throw new IllegalArgumentException("只支持图片文件格式");
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // 保存文件
        Path filePath = Paths.get(ID_CARD_DIR, uniqueFilename);
        Files.write(filePath, file.getBytes());

        // 返回相对路径
        return "id_card_images/" + uniqueFilename;
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

    /**
     * 验证是否为图片文件
     */
    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        return contentType != null &&
                (contentType.startsWith("image/") ||
                        contentType.equals("application/octet-stream"))
                &&
                originalFilename != null &&
                (originalFilename.toLowerCase().endsWith(".jpg") ||
                        originalFilename.toLowerCase().endsWith(".jpeg") ||
                        originalFilename.toLowerCase().endsWith(".png"));
    }
}