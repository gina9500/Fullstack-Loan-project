package com.loanguard.backend.model;

import lombok.Data;

@Data
public class CorporationLoanApplication {
    private Long id;
    private Long userId;
    private String companyName;
    private String businessLicense;
    private String companyEmail;
    private String companyAddress;
    private String accountBank;
    private String accountNo;
    private String loanAmount;
    private String loanTerm;
    private String loanPurpose;
    private String propertyType;
    private String propertyDocuments;
    private String industryCategory;
    private String status;
    private String createTime;
    private String updateTime;
}
