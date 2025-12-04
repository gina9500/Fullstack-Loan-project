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

import com.loanguard.backend.common.ErrorCode;
import com.loanguard.backend.common.ResponseResult;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.dto.CorporationLoanRequestDTO;
import com.loanguard.backend.service.CorporationLoanService;
import com.loanguard.backend.utils.SessionUtils;

@RestController
@RequestMapping("/api/loan")
public class CorporationLoanController {

    @Autowired
    private CorporationLoanService corporationLoanService;

    @Autowired
    private SessionUtils sessionUtils;

    /**
     * 提交企业贷款申请
     */
    @PostMapping("/corporation/submit")
    public ResponseResult<?> submitCorporationLoan(
            @ModelAttribute CorporationLoanRequestDTO requestDTO,
            @RequestParam("propProofDocs") MultipartFile propProofDocs) {

        try {
            // 获取真实的当前登录用户ID
            String userId = sessionUtils.getCurrentUserId();

            // 验证用户是否已登录
            if (userId == null) {
                return ResponseResult.fail("用户未登录，请先登录");
            }

            // 调用服务层处理
            Map<String, Object> result = corporationLoanService.submitLoanApplication(userId, requestDTO,
                    propProofDocs);

            // 返回成功响应
            return ResponseResult.success("提交成功", result);
        } catch (ServiceException e) {
            // 错误处理代码保持不变
            Map<String, String> fieldErrors = new HashMap<>();
            if (ErrorCode.USCC_FORMAT_ERROR.getCode().equals(e.getCode())) {
                fieldErrors.put("uscc", e.getMessage());
            } else if (ErrorCode.REPAY_ACCOUNT_ERROR.getCode().equals(e.getCode())) {
                fieldErrors.put("repayAccountNo", e.getMessage());
            } else if (ErrorCode.LOAN_AMOUNT_ERROR.getCode().equals(e.getCode())) {
                fieldErrors.put("loanAmount", e.getMessage());
            } else if (ErrorCode.CREDIT_LOAN_TERM_ERROR.getCode().equals(e.getCode()) ||
                    ErrorCode.TAX_LOAN_TERM_ERROR.getCode().equals(e.getCode())) {
                fieldErrors.put("loanTerm", e.getMessage());
            } else if (ErrorCode.JSON_PARSE_ERROR.getCode().equals(e.getCode())) {
                fieldErrors.put("propProofDocs", e.getMessage());
            }

            Map<String, Object> errorData = new HashMap<>();
            errorData.put("fieldErrors", fieldErrors);
            return ResponseResult.fail(e.getMessage(), errorData);
        } catch (Exception e) {
            // 记录异常日志
            e.printStackTrace();
            // 返回系统错误
            return ResponseResult.fail(ErrorCode.SYSTEM_ERROR.getMessage());
        }
    }
}