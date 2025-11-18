package com.loanguard.backend.controller;

import com.loanguard.backend.model.RiskAssessment;
import com.loanguard.backend.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk-assessments")
public class RiskAssessmentController {
    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @GetMapping
    public RiskAssessment getByApplicationIdAndType(@RequestParam Long applicationId,
            @RequestParam String applicationType) {
        return riskAssessmentService.findByApplicationIdAndType(applicationId, applicationType);
    }

    @PostMapping
    public int createAssessment(@RequestBody RiskAssessment assessment) {
        return riskAssessmentService.insert(assessment);
    }

    @PutMapping("/{id}")
    public int updateAssessment(@PathVariable Long id, @RequestBody RiskAssessment assessment) {
        assessment.setId(id);
        return riskAssessmentService.update(assessment);
    }
}
