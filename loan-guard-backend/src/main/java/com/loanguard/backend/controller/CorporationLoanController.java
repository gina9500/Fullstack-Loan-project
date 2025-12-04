package com.loanguard.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loanguard.backend.common.MsgCode;
import com.loanguard.backend.common.ResponseResult;
import com.loanguard.backend.dto.CorporationLoanRequestDTO;
import com.loanguard.backend.service.CorporationLoanService;
import com.loanguard.backend.utils.SessionUtils;

/**
 * 企业贷款控制层
 */
@RestController
@RequestMapping("/api/loan")
public class CorporationLoanController {

    private static final Logger logger = LoggerFactory.getLogger(CorporationLoanController.class);

    @Autowired
    private CorporationLoanService corporationLoanService;

    @Autowired
    private SessionUtils sessionUtils;

    /**
     * 企业贷款表单数据检查
     */
    @PostMapping("/corporation/check")
    public ResponseResult<?> submitCorporationLoan(
            @ModelAttribute CorporationLoanRequestDTO requestDTO,
            @RequestParam("propProofDocs") MultipartFile propProofDocs) {

        logger.error("企业贷款表单数据检查执行", requestDTO, propProofDocs);

        try {
            // 获取真实的当前登录用户ID
            String userId = sessionUtils.getCurrentUserId();

            // 验证用户是否已登录
            if (userId == null) {
                return ResponseResult.fail(MsgCode.USER_NOT_LOGGED_IN.getMessage());
            }

            // 调用服务层处理
            Map<String, Object> result = corporationLoanService.submitLoanApplication(userId, requestDTO,
                    propProofDocs);

            // 根据服务返回的success字段判断是否成功
            boolean success = Boolean.TRUE.equals(result.get("success"));

            if (success) {
                // 返回成功响应
                return ResponseResult.success(MsgCode.SUBMIT_SUCCESS.getMessage(), result);
            } else {
                // 返回失败响应，包含字段错误信息
                String message = (String) result.getOrDefault("message",
                        MsgCode.PARAMETER_VALIDATION_ERROR.getMessage());
                Map<String, Object> errorData = new HashMap<>();
                errorData.put("fieldErrors", result.get("fieldErrors"));

                // 记录errorData日志
                logger.error("参数校验失败，错误信息: {}, 详细错误数据: {}", message, errorData);

                return ResponseResult.fail(message, errorData);
            }
        } catch (Exception e) {
            // 其他异常
            e.printStackTrace();
            return ResponseResult.fail(MsgCode.SYSTEM_ERROR.getMessage());
        }
    }
}