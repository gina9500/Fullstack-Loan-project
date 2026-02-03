package com.loanguard.backend.model;

import lombok.Data;

@Data
public class PersonalLoan {
    private Long id;
    private String userId;
    private String name;
    private String idNumber;
    private String birthDate;
    private String idCardExpiryDate;
    private String mobileNo;
    private String email;
    private String appointmentNo;
    private String status;
    private String createTime;
    private String updateTime;
}