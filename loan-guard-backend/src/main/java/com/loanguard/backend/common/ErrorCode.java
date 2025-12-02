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
    USERNAME_PASSWORD_ERROR("4003", "用户名或密码错误"),
    USER_NOT_EXIST("4004", "用户不存在"),
    PASSWORD_ERROR("4005", "密码错误"),

    // 业务相关错误码
    OPERATION_FAILED("5001", "操作失败");

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