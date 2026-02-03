package com.loanguard.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.loanguard.backend.model.PersonalLoan;

@Mapper
public interface PersonalLoanMapper {

    /**
     * 插入个人贷款申请
     */
    int insertPersonalLoan(PersonalLoan personalLoan);

    /**
     * 根据预约号查询贷款申请
     */
    PersonalLoan selectByAppointmentNo(@Param("appointmentNo") String appointmentNo);

    /**
     * 根据user_id查询贷款申请
     */
    PersonalLoan selectByUserId(@Param("userId") String userId);

    /**
     * 根据user_id更新贷款申请
     */
    int updatePersonalLoanByUserId(PersonalLoan personalLoan);

    /**
     * 检查预约号是否已存在
     */
    int countByAppointmentNo(@Param("appointmentNo") String appointmentNo);
}