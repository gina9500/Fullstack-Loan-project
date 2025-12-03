package com.loanguard.backend.model;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 贷款实体类
 * 与数据库表corporation_loan_application对应
 */
@Data
public class CorporationLoan {
    private Long id;
    private Long userId;
    private String entName;
    private String uscc;
    private String companyEmail;
    private String companyAddress;
    private String repayAccountBank;
    private String repayAccountNo;
    private BigDecimal loanAmount;
    private String loanTerm;
    private String loanPurpose;
    private String propProofType;
    private String industryCategory;
    private String status;
    private String createTime;
    private String updateTime;
}