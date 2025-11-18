package com.loanguard.backend.mapper;

import com.loanguard.backend.model.RiskAssessment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RiskAssessmentMapper {
    int insert(RiskAssessment assessment);

    int update(RiskAssessment assessment);

    RiskAssessment findByApplicationIdAndType(Long applicationId, String applicationType);
}