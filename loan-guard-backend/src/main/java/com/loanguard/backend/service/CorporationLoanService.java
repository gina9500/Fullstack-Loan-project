package com.loanguard.backend.service;

import com.loanguard.backend.common.ErrorCode;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.dto.CorporationLoanRequestDTO;
import com.loanguard.backend.mapper.CorporationLoanMapper;
import com.loanguard.backend.mapper.FileMapper;
import com.loanguard.backend.model.CorporationLoan;
import com.loanguard.backend.model.File;
import com.loanguard.backend.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class CorporationLoanService {

    @Autowired
    private CorporationLoanMapper corporationLoanMapper;

    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    /**
     * 提交企业贷款申请
     */
    public Map<String, Object> submitLoanApplication(String userId, CorporationLoanRequestDTO requestDTO,
            MultipartFile propProofDocs) {
        // 验证请求数据
        validateRequestData(requestDTO);

        // 处理上传的JSON文件
        if (!propProofDocs.isEmpty()) {
            try {
                // 读取JSON文件内容
                String jsonContent = new String(propProofDocs.getBytes());
                // 解析JSON内容
                // 保存文件到服务器目录
                String filePath = "C:\\upload" + propProofDocs.getOriginalFilename();
                Files.copy(propProofDocs.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                // return ResponseEntity.badRequest().body(Map.of("success", false, "message",
                // "文件处理失败"));
            }
        }

        // 创建企业贷款申请记录
        CorporationLoan corporationLoan = new CorporationLoan();
        corporationLoan.setUserId(userId);
        corporationLoan.setEntName(requestDTO.getEntName());
        corporationLoan.setUscc(requestDTO.getUscc());
        corporationLoan.setCompanyEmail(requestDTO.getCompanyEmail());
        corporationLoan.setCompanyAddress(requestDTO.getCompanyAddress());
        corporationLoan.setRepayAccountBank(requestDTO.getRepayAccountBank());
        corporationLoan.setRepayAccountNo(requestDTO.getRepayAccountNo());
        corporationLoan.setLoanAmount(requestDTO.getLoanAmount());
        corporationLoan.setLoanTerm(requestDTO.getLoanTerm());
        corporationLoan.setLoanPurpose(requestDTO.getLoanPurpose());
        corporationLoan.setPropProofType(requestDTO.getPropProofType());
        corporationLoan.setIndustryCategory(requestDTO.getIndustryCategory());

        // 保存到数据库
        int result = corporationLoanMapper.insert(corporationLoan);
        if (result <= 0) {
            throw new ServiceException(ErrorCode.OPERATION_FAILED.getMessage());
        }

        // 返回结果
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("applicationId", corporationLoan.getId());
        responseData.put("entName", requestDTO.getEntName());
        responseData.put("uscc", requestDTO.getUscc());
        responseData.put("companyEmail", requestDTO.getCompanyEmail());
        responseData.put("companyAddress", requestDTO.getCompanyAddress());
        responseData.put("repayAccountBank", requestDTO.getRepayAccountBank());
        responseData.put("repayAccountNo", requestDTO.getRepayAccountNo());
        responseData.put("loanAmount", requestDTO.getLoanAmount());
        responseData.put("loanTerm", requestDTO.getLoanTerm());
        responseData.put("loanPurpose", requestDTO.getLoanPurpose());
        responseData.put("propProofType", requestDTO.getPropProofType());
        responseData.put("industryCategory", requestDTO.getIndustryCategory());

        return responseData;
    }

    /**
     * 验证请求数据
     */
    private void validateRequestData(CorporationLoanRequestDTO requestDTO) {
        Map<String, String> fieldErrors = new HashMap<>();

        // 验证必填字段
        if (requestDTO.getEntName() == null || requestDTO.getEntName().trim().isEmpty()) {
            fieldErrors.put("entName", "企业名称不能为空");
        }

        // 验证统一社会信用代码（18位字母数字）
        if (requestDTO.getUscc() == null || !Pattern.matches("^[A-Za-z0-9]{18}$", requestDTO.getUscc())) {
            fieldErrors.put("uscc", ErrorCode.USCC_FORMAT_ERROR.getMessage());
        }

        // 验证邮箱格式
        if (requestDTO.getCompanyEmail() == null
                || !Pattern.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", requestDTO.getCompanyEmail())) {
            fieldErrors.put("companyEmail", "邮箱格式不正确");
        }

        // 验证还款账户号码（19位数字）
        if (requestDTO.getRepayAccountNo() == null || !Pattern.matches("^\\d{19}$", requestDTO.getRepayAccountNo())) {
            fieldErrors.put("repayAccountNo", ErrorCode.REPAY_ACCOUNT_ERROR.getMessage());
        }

        // 验证贷款金额（非负数）
        if (requestDTO.getLoanAmount() == null) {
            fieldErrors.put("loanAmount", "贷款金额不能为空");
        } else {
            try {
                BigDecimal amount = requestDTO.getLoanAmount();
                if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                    fieldErrors.put("loanAmount", ErrorCode.LOAN_AMOUNT_ERROR.getMessage());
                }
            } catch (NumberFormatException e) {
                fieldErrors.put("loanAmount", "贷款金额格式不正确");
            }
        }

        // 验证贷款期限相关性
        validateLoanTerm(requestDTO.getLoanPurpose(), requestDTO.getLoanTerm(), fieldErrors);

        // 如果有字段错误，抛出异常
        if (!fieldErrors.isEmpty()) {
            throw new ServiceException(ErrorCode.PARAMETER_VALIDATION_ERROR.getMessage(),
                    ErrorCode.PARAMETER_VALIDATION_ERROR.getCode());
        }
    }

    /**
     * 验证贷款期限相关性
     */
    private void validateLoanTerm(String loanPurpose, String loanTerm, Map<String, String> fieldErrors) {
        if (loanPurpose != null && loanTerm != null) {
            // 信用贷款期限检查
            if (loanPurpose.contains("信用") || loanPurpose.contains("credit")) {
                try {
                    int termYears = Integer.parseInt(loanTerm);
                    if (termYears > 5) {
                        fieldErrors.put("loanTerm", ErrorCode.CREDIT_LOAN_TERM_ERROR.getMessage());
                    }
                } catch (NumberFormatException e) {
                    // 期限格式错误
                }
            }
            // 税贷期限检查
            if (loanPurpose.contains("税") || loanPurpose.contains("tax")) {
                try {
                    int termYears = Integer.parseInt(loanTerm);
                    if (termYears > 2) {
                        fieldErrors.put("loanTerm", ErrorCode.TAX_LOAN_TERM_ERROR.getMessage());
                    }
                } catch (NumberFormatException e) {
                    // 期限格式错误
                }
            }
        }
    }

    /**
     * 处理JSON文件
     */
    private Map<String, String> processJsonFile(MultipartFile file) {
        try {
            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.contains("json")) {
                throw new ServiceException(ErrorCode.FILE_TYPE_ERROR.getMessage());
            }

            // 解析JSON文件进行内容校验 - 移除未使用的变量
            // 直接保存文件，不再定义未使用的jsonNode变量

            // 保存文件
            String filePath = fileUploadUtil.saveJsonFile(file);

            Map<String, String> fileInfo = new HashMap<>();
            fileInfo.put("filePath", filePath);
            fileInfo.put("originalFileName", file.getOriginalFilename());
            fileInfo.put("fileType", contentType);

            return fileInfo;
        } catch (IOException e) {
            throw new ServiceException(ErrorCode.JSON_PARSE_ERROR.getMessage());
        }
    }

    /**
     * 保存文件信息
     */
    private void saveFileInfo(Long applicationId, Map<String, String> fileInfo, MultipartFile file) {
        File fileEntity = new File();
        fileEntity.setApplicationId(applicationId);
        fileEntity.setFileName(fileInfo.get("originalFileName"));
        fileEntity.setFilePath(fileInfo.get("filePath"));
        fileEntity.setFileType(fileInfo.get("fileType"));
        fileEntity.setFileSize(file.getSize());

        fileMapper.insert(fileEntity);
    }
}