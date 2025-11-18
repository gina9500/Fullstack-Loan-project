// 用户相关API
import { post } from '../utils/request';

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @returns {Promise} - 返回Promise对象
 */
export async function login(credentials) {
  return post('/user/login', credentials);
}

/**
 * 获取用户信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserInfo() {
  return post('/user/info');
}