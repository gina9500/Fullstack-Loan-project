// 贷款申请相关API
import { post, get } from '../utils/request';

/**
 * 提交个人贷款申请
 * @param {Object} applicationData - 申请数据
 * @returns {Promise} - 返回Promise对象
 */
export async function submitPersonalLoan(applicationData) {
  return post('/loan/personal/submit', applicationData);
}

/**
 * 提交企业贷款申请
 * @param {Object} applicationData - 申请数据
 * @returns {Promise} - 返回Promise对象
 */
export async function submitCorporationLoan(applicationData) {
  return post('/loan/corporation/submit', applicationData);
}

/**
 * 检查数据完整性
 * @param {Object} data - 要检查的数据
 * @returns {Promise} - 返回Promise对象
 */
export async function checkDataIntegrity(data) {
  return post('/loan/check/integrity', data);
}

/**
 * 获取风险评估结果
 * @param {string} applicationId - 申请ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getRiskAssessment(applicationId) {
  return get(`/loan/risk/assessment/${applicationId}`);
}

/**
 * 确认贷款申请
 * @param {string} applicationId - 申请ID
 * @returns {Promise} - 返回Promise对象
 */
export async function confirmLoanApplication(applicationId) {
  return post('/loan/application/confirm', { applicationId });
}