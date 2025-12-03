package com.loanguard.backend.common;

/**
 * 错误码类
 */
public enum ErrorCode {
    // 系统错误码
    SYSTEM_ERROR("500", "系统内部错误"),
    PARAMETER_VALIDATION_ERROR("400", "参数校验失败"),

    // 登录相关错误码
    USERNAME_EMPTY("4001", "用户名不能为空"),
    PASSWORD_EMPTY("4002", "密码不能为空"),
    USER_NOT_EXIST("4003", "用户不存在"),
    PASSWORD_ERROR("4004", "密码错误"),

    // 业务相关错误码
    OPERATION_FAILED("5001", "操作失败"),

    // 贷款相关错误码
    USCC_FORMAT_ERROR("6001", "统一社会信用代码必须为18位的英文字母和数字组合"),
    REPAY_ACCOUNT_ERROR("6002", "还款账户号码必须为19位的纯数字"),
    LOAN_AMOUNT_ERROR("6003", "贷款申请金额必须为非负数"),
    CREDIT_LOAN_TERM_ERROR("6004", "信用贷款期限不能超过5年"),
    TAX_LOAN_TERM_ERROR("6005", "税贷期限不能超过2年"),
    FILE_UPLOAD_ERROR("6006", "文件上传失败"),
    FILE_TYPE_ERROR("6007", "不支持的文件类型"),
    // 在枚举中添加以下错误码
    // 已有的贷款相关错误码后面添加
    JSON_PARSE_ERROR("6008", "JSON文件解析失败"),
    MISSING_REQUIRED_FIELD("6009", "缺少必填字段");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    /**
     * 根据错误码获取错误信息
     * 
     * @param code 错误码
     * @return 错误信息，如果未找到则返回未知错误
     */
    public static String getMessageByCode(String code) {
        for (ErrorCode errorCode : ErrorCode.values()) {
            if (errorCode.code.equals(code)) {
                return errorCode.message;
            }
        }
        return "未知错误";
    }
}