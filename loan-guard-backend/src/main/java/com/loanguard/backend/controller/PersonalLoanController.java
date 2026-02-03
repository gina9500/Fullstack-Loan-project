package com.loanguard.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loanguard.backend.common.ResponseResult;
import com.loanguard.backend.dto.PersonalLoanRequestDTO;
import com.loanguard.backend.service.PersonalLoanService;
import com.loanguard.backend.utils.SessionUtils;

/**
 * 个人贷款控制器
 */
@RestController
@RequestMapping("/api/loan")
public class PersonalLoanController {

    @Autowired
    private PersonalLoanService personalLoanService;

    @Autowired
    private SessionUtils sessionUtils;

    /**
     * 识别身份证信息
     */
    @PostMapping("/personal/ocr")
    public ResponseResult<?> recognizeIdCard(
            @RequestParam("frontFile") MultipartFile frontFile,
            @RequestParam("backFile") MultipartFile backFile) {

        try {
            // 验证文件类型
            if (!isValidImageFile(frontFile) || !isValidImageFile(backFile)) {
                return ResponseResult.fail("只支持jpg格式的图片文件");
            }

            Map<String, Object> result = personalLoanService.recognizeIdCard(frontFile, backFile);
            if (Boolean.TRUE.equals(result.get("success"))) {
                return ResponseResult.success("识别成功", result.get("idCardInfo"));
            } else {
                return ResponseResult.fail((String) result.get("message"));
            }
        } catch (Exception e) {
            return ResponseResult.fail("识别失败：" + e.getMessage());
        }
    }

    /**
     * 提交个人贷款申请
     */
    @PostMapping("/personal/submit")
    public ResponseResult<?> submitPersonalLoan(
            @ModelAttribute PersonalLoanRequestDTO requestDTO) {

        try {
            String userId = sessionUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseResult.fail("用户未登录");
            }

            Map<String, Object> result = personalLoanService.submitPersonalLoan(
                    userId, requestDTO);

            if (Boolean.TRUE.equals(result.get("success"))) {
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("appointmentNo", result.get("appointmentNo"));
                return ResponseResult.success("提交成功", responseData);
            } else {
                return ResponseResult.fail((String) result.get("message"));
            }
        } catch (Exception e) {
            return ResponseResult.fail("提交失败：" + e.getMessage());
        }
    }

    /**
     * 验证是否为有效图片文件
     */
    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        // 支持jpg、jpeg格式
        boolean isValidContentType = contentType != null &&
                (contentType.equals("image/jpeg") || contentType.equals("image/jpg"));

        boolean isValidExtension = originalFilename != null &&
                (originalFilename.toLowerCase().endsWith(".jpg") ||
                        originalFilename.toLowerCase().endsWith(".jpeg"));

        return isValidContentType && isValidExtension;
    }
}