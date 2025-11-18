package com.loanguard.backend.service;

import com.loanguard.backend.model.CorporationLoanApplication;
import com.loanguard.backend.mapper.CorporationLoanApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CorporationLoanApplicationService {
    @Autowired
    private CorporationLoanApplicationMapper corporationLoanApplicationMapper;

    public int insert(CorporationLoanApplication application) {
        return corporationLoanApplicationMapper.insert(application);
    }

    public int update(CorporationLoanApplication application) {
        return corporationLoanApplicationMapper.update(application);
    }

    public CorporationLoanApplication findById(Long id) {
        return corporationLoanApplicationMapper.findById(id);
    }

    public List<CorporationLoanApplication> findByUserId(Long userId) {
        return corporationLoanApplicationMapper.findByUserId(userId);
    }

    public List<CorporationLoanApplication> findAll() {
        return corporationLoanApplicationMapper.findAll();
    }
}