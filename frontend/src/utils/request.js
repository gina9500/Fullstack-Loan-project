// HTTP请求工具
import config from '../config/env';

/**
 * 封装的HTTP请求函数
 * @param {string} url - 请求地址
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
async function request(url, options = {}) {
  // 构建完整的URL
  const fullUrl = `${config.API_BASE_URL}${url}`;
  
  // 创建基本请求选项
  const requestOptions = {
    ...options,
    credentials: 'include', // 始终包含凭证
  };
  
  // 只在不是FormData请求且没有设置Content-Type时，才设置默认的Content-Type
  if (!options.isFormData && !requestOptions.headers?.['Content-Type'] && !requestOptions.headers?.['content-type']) {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  console.log("发送请求到:", fullUrl);

  try {
    
    // 添加请求超时机制（30秒）
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('请求超时，请稍后重试'));
      }, 30000);
    });
    
    // 使用Promise.race实现超时处理
    const response = await Promise.race([
      fetch(fullUrl, requestOptions),
      timeoutPromise
    ]);
    
    // 处理OPTIONS请求的204状态
    if (response.status === 204) {
      return null;
    }
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      throw new Error(`HTTP error! Status: ${response.status}. Details: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
  console.error('Request failed:', error);
  // 检查是否是401错误
  if (error.message.includes('401')) {
      // 清除token和用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // 可以添加一个临时的错误提示
      localStorage.setItem('loginError', 'Token已过期,请重新登录');
      // 最后跳转到登录页面
      window.location.href = '/login';
  }
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
  // 检查是否为FormData请求
  const isFormData = data instanceof FormData;
  
  // 获取token
  const token = localStorage.getItem('token');
  
  // 针对FormData请求的特殊处理
  if (isFormData) {
    const formDataOptions = {
      method: 'POST',
      isFormData: true,
      body: data,
      // 不要继承options中的headers，而是在下面手动处理
      ...options,
      headers: undefined // 清除options中的headers
    };
    
    // 如果有token，只添加Authorization头，不包含任何其他头
    if (token) {
      formDataOptions.headers = {
        Authorization: `Bearer ${token}`
      };
    } else {
      // 如果没有token，确保不设置任何headers
      formDataOptions.headers = undefined;
    }
    
    return request(url, formDataOptions);
  } else {
    // 非FormData请求的标准处理
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // 如果有token，添加Authorization头
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const standardOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      ...options
    };
    return request(url, standardOptions);
  }
}

export default request;