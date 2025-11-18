package com.loanguard.backend.mapper;

import com.loanguard.backend.model.IndividualLoanApplication;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface IndividualLoanApplicationMapper {
    int insert(IndividualLoanApplication application);

    int update(IndividualLoanApplication application);

    IndividualLoanApplication findById(Long id);

    List<IndividualLoanApplication> findByUserId(Long userId);

    List<IndividualLoanApplication> findAll();
}
