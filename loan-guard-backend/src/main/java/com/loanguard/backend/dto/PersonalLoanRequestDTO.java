package com.loanguard.backend.dto;

import lombok.Data;

@Data
public class PersonalLoanRequestDTO {
    private String name;
    private String idNumber;
    private String birthDate;
    private String idCardExpiryDate;
    private String mobileNo;
    private String email;
}