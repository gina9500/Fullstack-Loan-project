// HTTP请求工具
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
      // 尝试获取后端返回的错误详情
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
      } catch (jsonError) {
        // 如果响应不是JSON格式，尝试获取文本
        try {
          errorDetails = await response.text();
        } catch (textError) {
          errorDetails = '无法获取错误详情';
        }
      }
      throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
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
 * @param {Object|FormData} data - 请求数据
 * @param {Object} options - 附加选项
 * @returns {Promise} - 返回Promise对象
 */
export function post(url, data = {}, options = {}) {
  // 对于FormData对象，不进行JSON序列化且不设置Content-Type
  const isFormData = data instanceof FormData;
  
  console.log('数据类型:', isFormData ? 'FormData' : 'JSON');
  
  // 当是FormData时，需要移除Content-Type，让浏览器自动设置
  const requestOptions = {
    method: 'POST',
    ...options,
    body: isFormData ? data : JSON.stringify(data),
  };
  
  // 如果是FormData，确保不设置Content-Type
  if (isFormData) {
    requestOptions.headers = {}; // 清空headers，让浏览器自动设置multipart/form-data
    // 仅添加用户自定义的其他headers（如果有）
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        if (key.toLowerCase() !== 'content-type') {
          requestOptions.headers[key] = options.headers[key];
        }
      });
    }
  }
  
  console.log('最终请求选项:', requestOptions);
  return request(url, requestOptions);
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