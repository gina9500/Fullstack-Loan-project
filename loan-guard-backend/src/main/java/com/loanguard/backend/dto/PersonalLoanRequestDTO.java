package com.loanguard.backend.dto;

import lombok.Data;

/**
 * 个人贷款申请请求DTO
 */
@Data
public class PersonalLoanRequestDTO {
    private String name;
    private String idNumber;
    private String birthDate;
    private String idCardExpiryDate;
    private String mobileNo;
    private String email;
}