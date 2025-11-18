package com.loanguard.backend.controller;

import com.loanguard.backend.model.CorporationLoanApplication;
import com.loanguard.backend.model.RiskAssessment;
import com.loanguard.backend.service.CorporationLoanApplicationService;
import com.loanguard.backend.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/corporation-loans")
public class CorporationLoanApplicationController {
    @Autowired
    private CorporationLoanApplicationService corporationLoanApplicationService;
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @PostMapping
    public int createApplication(@RequestBody CorporationLoanApplication application) {
        application.setStatus("pending");
        int result = corporationLoanApplicationService.insert(application);

        // 自动进行风险评估
        String riskLevel = riskAssessmentService.assessRisk(application);
        RiskAssessment assessment = new RiskAssessment();
        assessment.setApplicationId(application.getId());
        assessment.setApplicationType("corporation");
        assessment.setRiskLevel(riskLevel);
        assessment.setAssessmentDetails("自动评估");
        assessment.setSuggestions("请等待人工审核");
        assessment.setAssessorId("system");
        riskAssessmentService.insert(assessment);

        return result;
    }

    @GetMapping("/{id}")
    public CorporationLoanApplication getApplicationById(@PathVariable Long id) {
        return corporationLoanApplicationService.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<CorporationLoanApplication> getApplicationsByUserId(@PathVariable Long userId) {
        return corporationLoanApplicationService.findByUserId(userId);
    }

    @GetMapping
    public List<CorporationLoanApplication> getAllApplications() {
        return corporationLoanApplicationService.findAll();
    }

    @PutMapping("/{id}")
    public int updateApplication(@PathVariable Long id, @RequestBody CorporationLoanApplication application) {
        application.setId(id);
        return corporationLoanApplicationService.update(application);
    }
}