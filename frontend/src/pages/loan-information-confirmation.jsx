// 贷款信息确认页面
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import './loan-information-confirmation.css';
// 导入FinancialChart组件
import FinancialChart from './FinancialChart';
import { submitLoanConfirmation } from '../api/loan';

const LoanInformationConfirmation = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 从localStorage获取申请信息
    const savedData = localStorage.getItem('loanApplication');
    console.log('从localStorage获取的数据:', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // 处理不同的数据结构情况
        let applicationDataToSet;
        let financialDataToSet = [];
        
        // 情况1: 直接包含formData和financialData（如截图所示）
        if (parsedData.formData) {
          applicationDataToSet = parsedData.formData;
          if (parsedData.financialData && Array.isArray(parsedData.financialData)) {
            financialDataToSet = parsedData.financialData;
          }
        }
        // 情况2: 嵌套在data对象中
        else if (parsedData.data) {
          if (parsedData.data.formData) {
            applicationDataToSet = parsedData.data.formData;
          } else {
            applicationDataToSet = parsedData.data;
          }
          if (parsedData.data.financialData && Array.isArray(parsedData.data.financialData)) {
            financialDataToSet = parsedData.data.financialData;
          }
        }
        // 情况3: 直接包含所有字段
        else {
          applicationDataToSet = parsedData;
          if (parsedData.financialData && Array.isArray(parsedData.financialData)) {
            financialDataToSet = parsedData.financialData;
          }
        }
        
        // 确保文件名被正确提取（检查多个可能的位置）
        let propProofDocsName = applicationDataToSet.propProofDocsName;
        if (!propProofDocsName) {
          // 检查原始数据中是否有文件名
          propProofDocsName = parsedData.propProofDocsName;
        }
        if (!propProofDocsName && parsedData.data) {
          // 检查data对象中是否有文件名
          propProofDocsName = parsedData.data.propProofDocsName;
        }
        
        // 更新applicationDataToSet，确保包含文件名
        applicationDataToSet = {
          ...applicationDataToSet,
          propProofDocsName: propProofDocsName || ''
        };
        
        console.log('最终使用的申请数据:', applicationDataToSet);
        console.log('最终使用的财务数据:', financialDataToSet);
        
        setApplicationData(applicationDataToSet);
        setFinancialData(financialDataToSet);
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

  // 设置默认mock数据。测试用
  const setDefaultData = () => {
    const defaultData = {
      entName: "",
      uscc: "",
      companyEmail: "",
      companyAddress: "",
      repayAccountBank: "",
      repayAccountNo: "",
      loanAmount: "",
      loanTerm: "",
      loanPurpose: "",
      propProofType: "",
      propProofDocsName: "",// 添加文件名字段
      industryCategory: ""
    };
    setApplicationData(defaultData);
  };

/**
 * 处理确认提交
 * 将表单数据提交到后端进行DB存储
 */
const handleConfirm = async () => {
  setIsSubmitting(true);
  setError(null);
  
  try {
    // 保存包含文件名的完整数据到localStorage，确保从结果页面返回时能恢复
    localStorage.setItem('loanApplication', JSON.stringify(applicationData));
    
    // 调用后端API提交确认的贷款申请数据
    const response = await submitLoanConfirmation(applicationData);
    console.log('提交确认结果:', response);
    
    // 处理API响应
    if (response.success) {
      // 如果成功，使用React Router导航到结果页面，并传递状态信息
      navigate('/loan-result', { state: { fromButton: true } });
    } else {
      // 如果失败，显示错误信息
      throw new Error(response.message || '提交失败，请稍后重试');
    }
  } catch (err) {
    setError(err.message || '网络错误，请稍后重试');
  } finally {
    setIsSubmitting(false);
  }
};

const handleBack = () => {
  // 设置retainData标记，指示需要保留表单数据
  localStorage.setItem('retainData', 'true');
  // 使用React Router导航返回企业贷款申请页面，并传递状态信息
  navigate('/corporation-loan-application', { state: { fromButton: true } });
};


  if (isLoading) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="loading">加载中...</div>
      </BaseLayout>
    );
  }

  if (error || !applicationData) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="error-message">
          {error || '申请信息不存在'}
          <button onClick={() => navigate('/')}>返回首页</button>
        </div>
      </BaseLayout>
    );
  }

  // 组件渲染
  return (
    <BaseLayout title="Loan Information Confirmation">
      <div className="loan-information-confirmation">
        <h2 style={{ textAlign: 'center' }}>Loan Information Confirmation</h2>
        
        {/* 贷款类型标识 */}
        <div className="loan-type-indicator">
          <span className="loan-type">Corporation Loan</span>
          <div className="underline"></div>
        </div>
        
        <div className="confirmation-card">
          {/* 企业贷款信息 - 表单样式 */}
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
                <div className="form-value">{applicationData.loanAmount !== undefined && applicationData.loanAmount !== null && applicationData.loanAmount !== '' ? applicationData.loanAmount : '-'}</div>
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
                <div className="form-value">{applicationData.propProofType || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Property Proof Document</label>
                <div className="form-value">{applicationData.propProofDocsName || '-'}</div>
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
        
{/* 财务数据图表部分 - 嵌套FinancialChart组件 */}
      <div className="financial-chart-section">
        <div className="chart-header">
          <div className="chart-title-container">
            <h3>财务数据图表</h3>
          </div>
        </div>
        
        <div className="chart-container">
          {/* 使用FinancialChart组件并传递财务数据 */}
          <FinancialChart financialData={financialData} />
        </div>
      </div>
        
        {/* 按钮 */}
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