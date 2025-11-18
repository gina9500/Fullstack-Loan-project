// HTTP请求工具函数
import config from '../config/env';

/**
 * 封装的HTTP请求函数
 * @param {string} url - 请求地址
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
async function request(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // 构建完整的URL
  const fullUrl = `${config.API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @returns {Promise} - 返回Promise对象
 */
export function get(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return request(fullUrl);
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {Promise} - 返回Promise对象
 */
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 文件上传
 * @param {string} url - 请求地址
 * @param {FormData} formData - 表单数据
 * @returns {Promise} - 返回Promise对象
 */
export function upload(url, formData) {
  return request(url, {
    method: 'POST',
    headers: {}, // 不需要Content-Type，浏览器会自动添加
    body: formData,
  });
}

export default request;