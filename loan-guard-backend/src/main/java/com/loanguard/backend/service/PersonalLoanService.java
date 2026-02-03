package com.loanguard.backend.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.loanguard.backend.dto.PersonalLoanRequestDTO;
import com.loanguard.backend.mapper.PersonalLoanMapper;
import com.loanguard.backend.model.PersonalLoan;

/**
 * 个人贷款服务类
 */
@Service
public class PersonalLoanService {

    @Autowired
    private PersonalLoanMapper personalLoanMapper;

    @Autowired
    private IdCardOcrService idCardOcrService;

    /**
     * 识别身份证信息
     */
    public Map<String, Object> recognizeIdCard(MultipartFile frontFile, MultipartFile backFile) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 识别身份证正面
            Map<String, String> frontInfo = idCardOcrService.recognizeFront(frontFile);
            if (frontInfo.containsKey("error")) {
                result.put("success", false);
                result.put("message", "身份证正面识别失败：" + frontInfo.get("error"));
                return result;
            }

            // 识别身份证反面
            Map<String, String> backInfo = idCardOcrService.recognizeBack(backFile);
            if (backInfo.containsKey("error")) {
                result.put("success", false);
                result.put("message", "身份证反面识别失败：" + backInfo.get("error"));
                return result;
            }

            // 合并识别结果
            Map<String, String> idCardInfo = new HashMap<>();
            idCardInfo.putAll(frontInfo);
            idCardInfo.putAll(backInfo);

            result.put("success", true);
            result.put("idCardInfo", idCardInfo);
            return result;

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "识别失败：" + e.getMessage());
            return result;
        }
    }

    /**
     * 提交个人贷款申请
     */
    public Map<String, Object> submitPersonalLoan(String userId, PersonalLoanRequestDTO requestDTO) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 根据user_id查询是否已存在记录
            PersonalLoan existingLoan = personalLoanMapper.selectByUserId(userId);
            String appointmentNo = null;

            if (existingLoan == null) {
                // 不存在记录，执行INSERT操作
                // 生成唯一11位预约号
                appointmentNo = generateUniqueAppointmentNo();

                // 创建贷款申请实体
                PersonalLoan personalLoan = new PersonalLoan();
                personalLoan.setUserId(userId);
                personalLoan.setName(requestDTO.getName());
                personalLoan.setIdNumber(requestDTO.getIdNumber());
                personalLoan.setBirthDate(requestDTO.getBirthDate());
                personalLoan.setIdCardExpiryDate(requestDTO.getIdCardExpiryDate());
                personalLoan.setMobileNo(requestDTO.getMobileNo());
                personalLoan.setEmail(requestDTO.getEmail());
                personalLoan.setAppointmentNo(appointmentNo);
                personalLoan.setStatus("pending");

                // 保存到数据库
                personalLoanMapper.insertPersonalLoan(personalLoan);
            } else {
                // 存在记录，执行UPDATE操作
                appointmentNo = existingLoan.getAppointmentNo();

                // 更新贷款申请实体
                existingLoan.setName(requestDTO.getName());
                existingLoan.setIdNumber(requestDTO.getIdNumber());
                existingLoan.setBirthDate(requestDTO.getBirthDate());
                existingLoan.setIdCardExpiryDate(requestDTO.getIdCardExpiryDate());
                existingLoan.setMobileNo(requestDTO.getMobileNo());
                existingLoan.setEmail(requestDTO.getEmail());
                existingLoan.setStatus("pending");

                // 更新到数据库
                personalLoanMapper.updatePersonalLoanByUserId(existingLoan);
            }

            result.put("success", true);
            result.put("appointmentNo", appointmentNo);
            return result;

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "提交失败：" + e.getMessage());
            return result;
        }
    }

    /**
     * 生成唯一11位预约号
     */
    private String generateUniqueAppointmentNo() {
        // 生成规则：年份后两位 + 月份 + 日期 + 5位随机数，总共11位
        // 2(年份后两位) + 2(月份) + 2(日期) + 5(随机数) = 11位
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
        String datePart = sdf.format(new Date()); // 获取当前日期的yyMMdd格式

        // 生成5位随机数
        Random random = new Random();
        String randomPart = String.format("%05d", random.nextInt(100000)); // 5位随机数

        // 组合日期和随机数，生成11位预约号
        String appointmentNo = datePart + randomPart;

        // 检查预约号是否已存在，如果存在则重新生成
        int retryCount = 0;
        while (personalLoanMapper.countByAppointmentNo(appointmentNo) > 0 && retryCount < 10) {
            randomPart = String.format("%05d", random.nextInt(100000));
            appointmentNo = datePart + randomPart;
            retryCount++;
        }

        if (retryCount >= 10) {
            throw new RuntimeException("无法生成唯一预约号");
        }

        return appointmentNo;
    }
}