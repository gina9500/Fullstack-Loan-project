package com.loanguard.backend.model;

import lombok.Data;

@Data
public class RiskAssessment {
    private Long id;
    private Long applicationId;
    private String applicationType;
    private String riskLevel;
    private String assessmentDetails;
    private String suggestions;
    private String assessorId;
    private String assessTime;
}
