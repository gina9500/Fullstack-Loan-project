package com.loanguard.backend.mapper;

import com.loanguard.backend.model.CorporationLoanApplication;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CorporationLoanApplicationMapper {
    int insert(CorporationLoanApplication application);

    int update(CorporationLoanApplication application);

    CorporationLoanApplication findById(Long id);

    List<CorporationLoanApplication> findByUserId(Long userId);

    List<CorporationLoanApplication> findAll();
}