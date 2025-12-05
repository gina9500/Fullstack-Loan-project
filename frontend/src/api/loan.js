// 贷款申请相关API
import { get, post } from '../utils/request';

/**
 * 检查提交企业贷款信息
 * @param {Object} data - 贷款申请数据
 * @param {File} file - 财产证明文件
 * @returns {Promise} - 返回Promise对象
 */
export async function checkCorporationLoan(data, file) {
  // 创建FormData对象
  const formData = new FormData();
  
  // 将表单所有字段单独添加到FormData
  formData.append('entName', data.entName);
  formData.append('uscc', data.uscc);
  formData.append('companyEmail', data.companyEmail);
  formData.append('companyAddress', data.companyAddress);
  formData.append('repayAccountBank', data.repayAccountBank);
  formData.append('repayAccountNo', data.repayAccountNo);
  formData.append('loanAmount', data.loanAmount);
  formData.append('loanTerm', data.loanTerm);
  formData.append('loanPurpose', data.loanPurpose);
  formData.append('propProofType', data.propProofType);
  if (data.industryCategory) {
    formData.append('industryCategory', data.industryCategory);
  }
  
  // 添加文件
  if (file) {
    formData.append('propProofDocs', file);
  }
  
  // 调试信息
  console.log('提交FormData对象到后端');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }
  
  try {

    const url = 'http://localhost:8080/api/loan/corporation/check';
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        errorDetails = await response.text();
      }
      throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      // 错误的特殊处理
      console.error('后端连接失败，请检查');
      throw new Error('无法连接到后端服务');
    }
    throw error;
  }
}

/**
 * 提交贷款申请确认
 * @param {Object} applicationData - 完整的贷款申请数据
 * @returns {Promise} - 返回Promise对象
 */
export async function submitLoanConfirmation(applicationData) {
  const url = '/loan/corporation/confirm';
  return post(url, applicationData);
}