// 贷款申请相关API
import { post, get } from '../utils/request';

/**
 * 提交企业贷款申请
 * @param {Object} data - 贷款申请数据
 * @returns {Promise} - 返回Promise对象
 */
export async function submitCorporationLoan(data) {
  return post('/loan/corporation/submit', data);
}

/**
 * 检查数据完整性
 * @param {Object} data - 待检查的数据
 * @returns {Promise} - 返回Promise对象
 */
export async function checkDataIntegrity(data) {
  return post('/loan/check/integrity', data);
}

/**
 * 获取风险评估
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