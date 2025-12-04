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
 * @param {Object} params - 查询参数
 * @param {Object} options - 附加选项
 * @returns {Promise} - 返回Promise对象
 */
export function get(url, params = {}, options = {}) {
  // 构建查询字符串
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  // 添加查询参数到URL
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return request(fullUrl, {
    ...options,
    method: 'GET'
  });
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
  
  return request(url, requestOptions);
}

export default request;