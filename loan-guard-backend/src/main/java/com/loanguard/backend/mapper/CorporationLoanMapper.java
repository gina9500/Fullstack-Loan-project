package com.loanguard.backend.mapper;

import com.loanguard.backend.model.CorporationLoan;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CorporationLoanMapper {

    /**
     * 插入企业贷款申请记录
     * 
     * @param loan 贷款申请信息
     * @return 影响行数
     */
    int insert(CorporationLoan loan);
}