// 贷款申请相关API
import { post, get } from '../utils/request';// 贷款信息确认页面组件
import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { confirmLoanApplication } from '../api/loan';
import './loan-information-confirmation.css';

/**
 * 贷款信息确认组件
 * 负责展示用户提交的企业贷款申请信息，供用户确认
 */
const LoanInformationConfirmation = () => {
  // 申请数据
  const [applicationData, setApplicationData] = useState(null);
  // 加载
  const [isLoading, setIsLoading] = useState(true);
  // 提交
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 错误信息
  const [error, setError] = useState(null);
  // 图表
  const [chartType, setChartType] = useState('同比');

  /**
   * 组件挂载时从localStorage获取申请信息
   * 如果获取失败或不存在，使用默认数据
   */
  useEffect(() => {
    // 从localStorage获取申请信息
    const savedData = localStorage.getItem('corporationLoanData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);
      } catch (err) {
        console.error('解析申请数据失败:', err);
        // 如果解析失败，使用默认数据
        setDefaultData();
      }
    } else {
      // 如果localStorage中没有数据，使用默认数据
      setDefaultData();
    }
    setIsLoading(false);
  }, []);

  /**
   * 设置默认mock数据函数
   * 当前注释掉，但保留用于开发测试
   */
  // const setDefaultData = () => {
  //   const defaultData = {
  //     // entName: "ABC Corporation",
  //     // uscc: "91110000MA007XXXX",
  //     // companyEmail: "contact@abccorp.com",
  //     // companyAddress: "北京市朝阳区建国路88号",
  //     // repayAccountBank: "中国建设银行",
  //     // repayAccountNo: "6227 0000 1111 2222",
  //     // loanAmount: "5000000",
  //     // loanTerm: "36个月",
  //     // loanPurpose: "企业扩张",
  //     // propertyProofType: "房产抵押",
  //     // propertyProofDocument: true,
  //     // industryCategory: "科技行业"
  //   };
  //   setApplicationData(defaultData);
  // };

  /**
   * 处理确认提交操作
   * 模拟API调用后跳转到结果页面
   */
  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // 由于没有后端API，直接跳转到结果页面
      setTimeout(() => {
        window.location.href = '/loan-result';
      }, 1000);
    } catch (err) {
      console.error('确认申请出错:', err);
      alert('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 处理返回操作
   * 返回企业贷款申请页面
   */
  const handleBack = () => {
    // 返回企业贷款申请页面
    window.location.href = '/corporation-loan-application';
  };

  // 模拟财务数据（当前注释掉相关展示逻辑）
  const financialData = [
    { month: '2023.01', value: 4000 },
    { month: '2023.02', value: 4200 },
    { month: '2023.03', value: 4100 },
    { month: '2023.04', value: 4300 },
    { month: '2023.05', value: 4400 },
    { month: '2023.06', value: 4600 },
  ];

  // 加载状态渲染
  if (isLoading) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="loading">加载中...</div>
      </BaseLayout>
    );
  }

  // 错误状态或无数据渲染
  if (error || !applicationData) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="error-message">
          {error || '申请信息不存在'}
          <button onClick={() => window.location.href = '/'}>返回首页</button>
        </div>
      </BaseLayout>
    );
  }

  // 主页面渲染
  return (
    <BaseLayout title="Loan Information Confirmation">
      <div className="loan-information-confirmation">
        <div className="page-title">企业确认画面</div>
        <h2>Loan Information Confirmation</h2>
        
        {/* 贷款类型标识区域 */}
        <div className="loan-type-indicator">
          <span className="loan-type">Corporation Loan</span>
          <div className="underline"></div>
        </div>
        
        {/* 确认卡片区域 */}
        <div className="confirmation-card">
          {/* 企业贷款信息 - 表单样式展示 */}
          <div className="form-style">
            <div className="form-row">
              <div className="form-field">
                <label>Company Name</label>
                <div className="form-value">{applicationData.entName || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Uscc</label>
                <div className="form-value">{applicationData.uscc || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Company Email</label>
                <div className="form-value">{applicationData.companyEmail || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Company Address</label>
                <div className="form-value">{applicationData.companyAddress || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Repay Account Bank</label>
                <div className="form-value">{applicationData.repayAccountBank || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Repay Account No</label>
                <div className="form-value">{applicationData.repayAccountNo || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Amount</label>
                <div className="form-value">{applicationData.loanAmount || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Term</label>
                <div className="form-value">{applicationData.loanTerm || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Purpose</label>
                <div className="form-value">{applicationData.loanPurpose || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Property Proof Type</label>
                <div className="form-value">{applicationData.propertyProofType || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Property Proof Document</label>
                <div className="form-value">{applicationData.propertyProofDocument ? '文件已上传' : '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Industry Category</label>
                <div className="form-value">{applicationData.industryCategory || '-'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 财务数据图表部分（当前注释掉）
        <div className="financial-chart-section">
          <h3>
            财务数据图表 <span>预测值</span>
          </h3>
          <div className="chart-container">
            <div className="mock-chart">
              <div className="chart-header">累计金额</div>
              <div className="chart-bars">
                {financialData.map((item, index) => {
                  // 计算柱子高度，最大值为100%
                  const maxValue = Math.max(...financialData.map(d => d.value));
                  const height = (item.value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="bar-group">
                      <div 
                        className="bar" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="bar-label">{item.month}</div>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <label>
                  <input 
                    type="radio" 
                    name="chartType" 
                    value="同比" 
                    checked={chartType === '同比'} 
                    onChange={(e) => setChartType(e.target.value)} 
                  />
                  同比
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="chartType" 
                    value="环比" 
                    checked={chartType === '环比'} 
                    onChange={(e) => setChartType(e.target.value)} 
                  />
                  环比
                </label>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* 按钮操作区域 */}
        <div className="form-actions">
          <button 
            className="back-button"
            onClick={handleBack}
          >
            back
          </button>
          <button 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            confirm
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoanInformationConfirmation;


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