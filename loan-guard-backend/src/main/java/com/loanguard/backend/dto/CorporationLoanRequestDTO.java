package com.loanguard.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 企业贷款表单请求参数类
 */
@Data
public class CorporationLoanRequestDTO {
    private String entName; // 企业名称
    private String uscc; // 统一社会信用代码
    private String companyEmail; // 企业邮箱
    private String companyAddress; // 企业地址
    private String repayAccountBank; // 还款账户银行
    private String repayAccountNo; // 还款账户号码
    private BigDecimal loanAmount; // 贷款金额
    private String loanTerm; // 贷款期限
    private String loanPurpose; // 贷款目的
    private String propProofType; // 财产证明类型
    private String industryCategory; // 行业类别
}