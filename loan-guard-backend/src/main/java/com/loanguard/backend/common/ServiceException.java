package com.loanguard.backend.common;

import lombok.Getter;

/**
 * 业务异常封装类
 */
@Getter
public class ServiceException extends RuntimeException {

    /**
     * 错误码
     */
    private final String code;

    /**
     * 构造函数
     */
    public ServiceException() {
        super("业务异常");
        this.code = "500";
    }

    /**
     * 构造函数（带消息）
     */
    public ServiceException(String message) {
        super(message);
        this.code = "500";
    }

    /**
     * 构造函数（带消息和错误码）
     */
    public ServiceException(String message, String code) {
        super(message);
        this.code = code;
    }

}