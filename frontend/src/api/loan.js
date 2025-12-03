// 贷款申请相关API
import { get } from '../utils/request';

/**
 * 提交企业贷款信息
 * @param {Object} data - 贷款申请数据
 * @param {File} file - 财产证明文件
 * @returns {Promise} - 返回Promise对象
 */
export async function submitCorporationLoan(data, file) {
  // 创建FormData对象
  const formData = new FormData();
  
  // 将所有字段单独添加到FormData
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
  
  // 尝试不同的连接方式
  try {
    // 直接使用fetch API
    const url = 'http://localhost:8080/api/loan/corporation/submit';
    // 也可以尝试使用127.0.0.1替代localhost
    // const url = 'http://127.0.0.1:8880/api/loan/corporation/submit';
    
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
      // 连接错误的特殊处理
      console.error('后端连接失败，请检查：');
      console.error('1. 后端服务是否已启动');
      console.error('2. 端口号是否正确（当前使用8880）');
      console.error('3. 网络连接是否正常');
      throw new Error('无法连接到后端服务，请确保服务器已启动并运行在正确的端口上。');
    }
    throw error;
  }
}

/**
 * 确认贷款申请
 * @param {string} applicationId - 申请ID
 * @returns {Promise} - 返回Promise对象
 */
export async function confirmLoanApplication(applicationId) {
  return get('/loan/application/confirm', { applicationId });
}