package com.loanguard.backend.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loanguard.backend.common.MsgCode;
import com.loanguard.backend.common.ServiceException;
import com.loanguard.backend.dto.CorporationLoanRequestDTO;
import com.loanguard.backend.utils.FileUploadUtil;

/**
 * 企业贷款服务层
 */
@Service
public class CorporationLoanService {

    @Autowired
    private FileUploadUtil fileUploadUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 提交企业贷款申请
     */
    public Map<String, Object> submitLoanApplication(String userId, CorporationLoanRequestDTO requestDTO,
            MultipartFile propProofDocs) {
        // 验证请求数据并获取错误信息
        Map<String, String> fieldErrors = validateRequestData(requestDTO);

        // 初始化响应结果
        Map<String, Object> responseData = new HashMap<>();

        // 如果有验证错误，返回错误信息
        if (!fieldErrors.isEmpty()) {
            responseData.put("success", false);
            responseData.put("fieldErrors", fieldErrors);
            responseData.put("message", MsgCode.PARAMETER_VALIDATION_ERROR.getMessage());
            return responseData;
        }

        // 验证通过，继续处理
        responseData.put("success", true);
        responseData.put("message", MsgCode.DATA_VALIDATION_PASSED.getMessage());

        // 处理并提取上传的财务JSON文件数据
        if (propProofDocs != null && !propProofDocs.isEmpty()) {
            try {
                // 提取JSON文件内容
                Object financialData = extractFinancialData(propProofDocs);
                // 将提取的财务数据添加到响应中
                responseData.put("financialData", financialData);
                responseData.put("message", MsgCode.FINANCIAL_FILE_PARSED_SUCCESS.getMessage());
            } catch (Exception e) {
                // 文件处理错误
                responseData.put("success", false);
                responseData.put("message", MsgCode.FILE_UPLOAD_ERROR.getMessage());
                Map<String, String> fileErrors = new HashMap<>();
                fileErrors.put("propProofDocs", MsgCode.FILE_UPLOAD_ERROR.getMessage());
                responseData.put("fieldErrors", fileErrors);
            }
        }

        return responseData;
    }

    /**
     * 验证请求数据
     */
    private Map<String, String> validateRequestData(CorporationLoanRequestDTO requestDTO) {
        Map<String, String> fieldErrors = new HashMap<>();

        // 验证统一社会信用代码（18位英数字且不能是纯数字或纯字母）
        if (requestDTO.getUscc() == null || !Pattern.matches("^[A-Za-z0-9]{18}$", requestDTO.getUscc())) {
            fieldErrors.put("uscc", MsgCode.USCC_FORMAT_ERROR.getMessage());
        } else if (requestDTO.getUscc().matches("^\\d{18}$") || requestDTO.getUscc().matches("^[A-Za-z]{18}$")) {
            // 不能是纯数字或纯字母
            fieldErrors.put("uscc", MsgCode.USCC_NOT_PURE_NUMERIC_OR_ALPHA.getMessage());
        }

        // 验证还款账户号码（19位数字）
        if (requestDTO.getRepayAccountNo() == null || !Pattern.matches("^\\d{19}$", requestDTO.getRepayAccountNo())) {
            fieldErrors.put("repayAccountNo", MsgCode.REPAY_ACCOUNT_ERROR.getMessage());
        }

        // 验证贷款金额（非负数）
        if (requestDTO.getLoanAmount() == null) {
            fieldErrors.put("loanAmount", MsgCode.LOAN_AMOUNT_EMPTY.getMessage());
        } else {
            try {
                BigDecimal amount = requestDTO.getLoanAmount();
                if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                    fieldErrors.put("loanAmount", MsgCode.LOAN_AMOUNT_ERROR.getMessage());
                }
            } catch (Exception e) {
                fieldErrors.put("loanAmount", MsgCode.LOAN_AMOUNT_FORMAT_ERROR.getMessage());
            }
        }

        // 验证信用贷款期限,税贷期限相关性
        validateLoanTerm(requestDTO.getLoanPurpose(), requestDTO.getLoanTerm(), fieldErrors);

        return fieldErrors;
    }

    /**
     * 验证贷款期限相关性
     */
    private void validateLoanTerm(String loanPurpose, String loanTerm, Map<String, String> fieldErrors) {
        if (loanPurpose != null && loanTerm != null && !loanTerm.trim().isEmpty()) {
            // 移除"年"字，提取纯数字部分
            String numericPart = loanTerm.replaceAll("[^0-9]", "");
            if (!numericPart.isEmpty()) {
                int termYears = Integer.parseInt(numericPart);

                // 信用贷款期限检查：确保不超过5年
                if (loanPurpose.contains("信用")) {
                    if (termYears > 5) {
                        fieldErrors.put("loanTerm", MsgCode.CREDIT_LOAN_TERM_ERROR.getMessage());
                    }
                }
                // 税贷期限检查：确保不超过2年
                if (loanPurpose.contains("税")) {
                    if (termYears > 2) {
                        fieldErrors.put("loanTerm", MsgCode.TAX_LOAN_TERM_ERROR.getMessage());
                    }
                }
            }
        }
    }

    /**
     * 提取财务JSON文件数据
     */
    private Object extractFinancialData(MultipartFile file) throws IOException {
        // 验证文件类型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.contains("json")) {
            throw new ServiceException(MsgCode.FILE_TYPE_ERROR.getMessage());
        }

        // 先读取文件内容到字节数组
        byte[] fileBytes = file.getBytes();

        // 保存文件到指定路径
        fileUploadUtil.saveJsonFile(file);

        // 使用字节数组创建新的输入流进行解析
        JsonNode rootNode = objectMapper.readTree(fileBytes);

        // 将JSON数据转换为Map
        return convertJsonNodeToMap(rootNode);
    }

    /**
     * 将JsonNode转换为Map或List，便于前端处理
     */
    private Object convertJsonNodeToMap(JsonNode node) {
        // 如果是数组，返回List
        if (node.isArray()) {
            List<Object> arrayList = new ArrayList<>();
            for (JsonNode element : node) {
                arrayList.add(convertJsonNodeToMap(element));
            }
            return arrayList;
        }
        // 如果是对象，返回Map
        else if (node.isObject()) {
            Map<String, Object> result = new HashMap<>();
            for (Map.Entry<String, JsonNode> entry : node.properties()) {
                String key = entry.getKey();
                JsonNode value = entry.getValue();
                result.put(key, convertJsonNodeToMap(value));
            }
            return result;
        }
        // 基本类型直接返回
        else if (node.isTextual()) {
            return node.asText();
        } else if (node.isNumber()) {
            return node.numberValue();
        } else if (node.isBoolean()) {
            return node.booleanValue();
        } else if (node.isNull()) {
            return null;
        }
        // 默认返回字符串表示
        return node.toString();
    }
}