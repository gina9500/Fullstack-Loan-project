package com.loanguard.backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.baidu.aip.ocr.AipOcr;

/**
 * 身份证OCR服务类
 */
@Service
public class IdCardOcrService {

    private static final Logger logger = Logger.getLogger(IdCardOcrService.class.getName());

    @Autowired
    private AipOcr aipOcr;

    /**
     * 识别身份证正面
     */
    public Map<String, String> recognizeFront(MultipartFile file) throws Exception {
        logger.info("开始识别身份证正面: " + file.getOriginalFilename());

        if (file.isEmpty()) {
            throw new RuntimeException("上传的文件为空");
        }

        byte[] image = file.getBytes();
        logger.info("图片大小: " + image.length + " 字节");

        HashMap<String, String> options = new HashMap<>();
        options.put("detect_direction", "true");
        options.put("detect_risk", "false");
        options.put("accuracy", "high"); // 提高识别精度到high

        JSONObject result = aipOcr.idcard(image, "front", options);
        logger.info("正面识别结果: " + result.toString());

        return parseIdCardResult(result, "front");
    }

    /**
     * 识别身份证反面
     */
    public Map<String, String> recognizeBack(MultipartFile file) throws Exception {
        logger.info("开始识别身份证反面: " + file.getOriginalFilename());

        if (file.isEmpty()) {
            throw new RuntimeException("上传的文件为空");
        }

        byte[] image = file.getBytes();
        logger.info("图片大小: " + image.length + " 字节");

        HashMap<String, String> options = new HashMap<>();
        options.put("detect_direction", "true");

        JSONObject result = aipOcr.idcard(image, "back", options);
        logger.info("反面识别结果: " + result.toString());

        return parseIdCardResult(result, "back");
    }

    /**
     * 解析身份证识别结果
     */
    private Map<String, String> parseIdCardResult(JSONObject result, String side) {
        Map<String, String> info = new HashMap<>();

        if (result.has("error_code")) {
            String errorMsg = "错误代码: " + result.getInt("error_code") + ", 错误信息: " + result.getString("error_msg");
            logger.severe("OCR识别错误: " + errorMsg);
            info.put("error", errorMsg);
            return info;
        }

        if (!result.has("words_result")) {
            logger.severe("OCR结果格式错误，缺少words_result字段");
            info.put("error", "识别结果格式错误");
            return info;
        }

        JSONObject wordsResult = result.getJSONObject("words_result");
        logger.info("words_result: " + wordsResult.toString());

        if ("front".equals(side)) {
            // 解析姓名
            if (wordsResult.has("姓名")) {
                info.put("name", wordsResult.getJSONObject("姓名").getString("words"));
            }

            // 解析身份证号码 - 尝试多种可能的字段名
            String idNumber = "";

            // 尝试常见的中文字段名
            if (wordsResult.has("公民身份号码")) {
                idNumber = wordsResult.getJSONObject("公民身份号码").getString("words");
                // 输出公民身份号码到控制台
                if (!idNumber.isEmpty()) {
                    System.out.println("公民身份号码: " + idNumber);
                } else {
                    System.out.println("未识别到公民身份号码");
                }
            } else if (wordsResult.has("身份证号码")) {
                idNumber = wordsResult.getJSONObject("身份证号码").getString("words");
            } else if (wordsResult.has("id_card_number")) {
                idNumber = wordsResult.getJSONObject("id_card_number").getString("words");
            } else {
                // 兜底方案：遍历所有识别结果，查找18位身份证号码
                for (String key : wordsResult.keySet()) {
                    JSONObject wordObj = wordsResult.getJSONObject(key);
                    String text = wordObj.getString("words");
                    if (text.matches(
                            "^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$")) {
                        idNumber = text;
                        break;
                    }
                }
            }

            // 清理身份证号码中的空格等特殊字符
            if (!idNumber.isEmpty()) {
                idNumber = idNumber.replaceAll("\\s", "").trim();
                // 确保最后一位X是大写
                if (idNumber.endsWith("x")) {
                    idNumber = idNumber.substring(0, idNumber.length() - 1) + "X";
                }
            }

            info.put("idNumber", idNumber);

            // 解析出生日期并格式化
            if (wordsResult.has("出生")) {
                String birthDate = wordsResult.getJSONObject("出生").getString("words");
                // 将"1990年3月25日"格式化为"1990-03-25"
                birthDate = birthDate.replace("年", "-").replace("月", "-").replace("日", "");
                // 确保月份和日期为两位数
                String[] parts = birthDate.split("-");
                if (parts.length == 3) {
                    birthDate = String.format("%s-%02d-%02d", parts[0], Integer.parseInt(parts[1]),
                            Integer.parseInt(parts[2]));
                }
                info.put("birthDate", birthDate);
            }

            // 解析性别
            if (wordsResult.has("性别")) {
                info.put("gender", wordsResult.getJSONObject("性别").getString("words"));
            }

            // 解析民族
            if (wordsResult.has("民族")) {
                info.put("nation", wordsResult.getJSONObject("民族").getString("words"));
            }

        } else if ("back".equals(side)) {
            // 解析有效期
            if (wordsResult.has("失效日期")) {
                info.put("expiryDate", wordsResult.getJSONObject("失效日期").getString("words"));
            } else if (wordsResult.has("有效期限")) {
                info.put("expiryDate", wordsResult.getJSONObject("有效期限").getString("words"));
            }
        }

        logger.info("解析后的识别结果: " + info.toString());
        return info;
    }
}