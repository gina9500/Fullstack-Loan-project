package com.loanguard.backend.service;

import com.loanguard.backend.model.IndividualLoanApplication;
import com.loanguard.backend.mapper.IndividualLoanApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IndividualLoanApplicationService {
    @Autowired
    private IndividualLoanApplicationMapper individualLoanApplicationMapper;

    public int insert(IndividualLoanApplication application) {
        return individualLoanApplicationMapper.insert(application);
    }

    public int update(IndividualLoanApplication application) {
        return individualLoanApplicationMapper.update(application);
    }

    public IndividualLoanApplication findById(Long id) {
        return individualLoanApplicationMapper.findById(id);
    }

    public List<IndividualLoanApplication> findByUserId(Long userId) {
        return individualLoanApplicationMapper.findByUserId(userId);
    }

    public List<IndividualLoanApplication> findAll() {
        return individualLoanApplicationMapper.findAll();
    }
}