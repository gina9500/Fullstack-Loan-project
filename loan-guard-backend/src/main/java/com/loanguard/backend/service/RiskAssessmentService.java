package com.loanguard.backend.service;

import com.loanguard.backend.model.RiskAssessment;
import com.loanguard.backend.mapper.RiskAssessmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RiskAssessmentService {
    @Autowired
    private RiskAssessmentMapper riskAssessmentMapper;

    public int insert(RiskAssessment assessment) {
        return riskAssessmentMapper.insert(assessment);
    }

    public int update(RiskAssessment assessment) {
        return riskAssessmentMapper.update(assessment);
    }

    public RiskAssessment findByApplicationIdAndType(Long applicationId, String applicationType) {
        return riskAssessmentMapper.findByApplicationIdAndType(applicationId, applicationType);
    }

    // 风险评估逻辑
    public String assessRisk(Object application) {
        // 这里实现风险评估算法
        // 根据提供的信息判断风险等级
        return "medium"; // 示例返回中等风险
    }
}