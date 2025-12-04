package com.loanguard.backend.common;

/**
 * 消息码类 - 封装所有系统消息
 */
public enum MsgCode {
    // 系统错误码
    SYSTEM_ERROR("500", "系统内部错误"),
    PARAMETER_VALIDATION_ERROR("400", "参数校验失败"),

    // 登录相关消息
    USERNAME_EMPTY("4001", "用户名不能为空"),
    PASSWORD_EMPTY("4002", "密码不能为空"),
    USER_NOT_EXIST("4003", "用户不存在"),
    PASSWORD_ERROR("4004", "密码错误"),

    // 业务相关消息
    OPERATION_FAILED("5001", "操作失败"),

    // 贷款相关消息
    USCC_FORMAT_ERROR("6001", "统一社会信用代码必须为18位的英文字母和数字组合"),
    USCC_NOT_PURE_NUMERIC_OR_ALPHA("6001-1", "统一社会信用代码不能是纯数字或纯字母"),
    REPAY_ACCOUNT_ERROR("6002", "还款账户号码必须为19位的纯数字"),
    LOAN_AMOUNT_ERROR("6003", "贷款申请金额必须为非负数"),
    LOAN_AMOUNT_EMPTY("6003-1", "贷款金额不能为空"),
    LOAN_AMOUNT_FORMAT_ERROR("6003-2", "贷款金额格式不正确"),
    CREDIT_LOAN_TERM_ERROR("6004", "信用贷款期限不能超过5年"),
    TAX_LOAN_TERM_ERROR("6005", "税贷期限不能超过2年"),
    FILE_UPLOAD_ERROR("6006", "文件上传到后端失败"),
    FILE_TYPE_ERROR("6007", "不支持的文件类型"),
    JSON_PARSE_ERROR("6008", "JSON文件解析失败"),
    MISSING_REQUIRED_FIELD("6009", "缺少必填字段"),

    // 成功消息
    SUCCESS("200", "操作成功"),
    DATA_VALIDATION_PASSED("200-1", "数据验证通过"),
    FINANCIAL_FILE_PARSED_SUCCESS("200-2", "数据验证通过，财务文件解析成功"),
    SUBMIT_SUCCESS("200-3", "提交成功"),

    // 用户相关消息
    USER_NOT_LOGGED_IN("401", "用户未登录，请先登录");

    private final String code;
    private final String message;

    MsgCode(String code, String message) {
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
     * 根据消息码获取消息内容
     * 
     * @param code 消息码
     * @return 消息内容，如果未找到则返回未知错误
     */
    public static String getMessageByCode(String code) {
        for (MsgCode msgCode : MsgCode.values()) {
            if (msgCode.code.equals(code)) {
                return msgCode.message;
            }
        }
        return "未知错误";
    }
}