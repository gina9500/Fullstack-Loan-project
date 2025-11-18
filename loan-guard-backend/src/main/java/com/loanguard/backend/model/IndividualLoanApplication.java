package com.loanguard.backend.model;

import lombok.Data;

@Data
public class IndividualLoanApplication {
    private Long id;
    private Long userId;
    private String name;
    private String idNumber;
    private String phone;
    private String email;
    private String address;
    private String occupation;
    private String income;
    private String loanAmount;
    private String loanTerm;
    private String loanPurpose;
    private String propertyType;
    private String propertyDocuments;
    private String status;
    private String createTime;
    private String updateTime;
}
