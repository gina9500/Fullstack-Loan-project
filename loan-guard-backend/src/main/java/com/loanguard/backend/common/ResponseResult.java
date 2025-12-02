package com.loanguard.backend.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API响应结果封装类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseResult<T> {

    /**
     * true表示成功，false表示失败
     */
    private boolean success;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 成功响应（带消息）
     */
    public static <T> ResponseResult<T> success(String message) {
        return new ResponseResult<>(true, message, null);
    }

    /**
     * 成功响应（带消息和数据）
     */
    public static <T> ResponseResult<T> success(String message, T data) {
        return new ResponseResult<>(true, message, data);
    }

    /**
     * 失败响应（带消息）
     */
    public static <T> ResponseResult<T> fail(String message) {
        return new ResponseResult<>(false, message, null);
    }

    /**
     * 失败响应（带消息和数据）
     */
    public static <T> ResponseResult<T> fail(String message, T data) {
        return new ResponseResult<>(false, message, data);
    }
}