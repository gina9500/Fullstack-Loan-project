package com.loanguard.backend.controller;

import com.loanguard.backend.model.IndividualLoanApplication;
import com.loanguard.backend.model.RiskAssessment;
import com.loanguard.backend.service.IndividualLoanApplicationService;
import com.loanguard.backend.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/individual-loans")
public class IndividualLoanApplicationController {
    @Autowired
    private IndividualLoanApplicationService individualLoanApplicationService;
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @PostMapping
    public int createApplication(@RequestBody IndividualLoanApplication application) {
        application.setStatus("pending");
        int result = individualLoanApplicationService.insert(application);

        // 自动进行风险评估
        String riskLevel = riskAssessmentService.assessRisk(application);
        RiskAssessment assessment = new RiskAssessment();
        assessment.setApplicationId(application.getId());
        assessment.setApplicationType("individual");
        assessment.setRiskLevel(riskLevel);
        assessment.setAssessmentDetails("自动评估");
        assessment.setSuggestions("请等待人工审核");
        assessment.setAssessorId("system");
        riskAssessmentService.insert(assessment);

        return result;
    }

    @GetMapping("/{id}")
    public IndividualLoanApplication getApplicationById(@PathVariable Long id) {
        return individualLoanApplicationService.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<IndividualLoanApplication> getApplicationsByUserId(@PathVariable Long userId) {
        return individualLoanApplicationService.findByUserId(userId);
    }

    @GetMapping
    public List<IndividualLoanApplication> getAllApplications() {
        return individualLoanApplicationService.findAll();
    }

    @PutMapping("/{id}")
    public int updateApplication(@PathVariable Long id, @RequestBody IndividualLoanApplication application) {
        application.setId(id);
        return individualLoanApplicationService.update(application);
    }
}