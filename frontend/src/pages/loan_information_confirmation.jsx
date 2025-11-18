// 贷款信息确认页面
import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { confirmLoanApplication } from '../api/loan';
import './loan-information-confirmation.css';

const LoanInformationConfirmation = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 从localStorage获取申请信息
    const savedData = localStorage.getItem('loanApplication');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);
      } catch (err) {
        console.error('解析申请数据失败:', err);
        setError('获取申请信息失败，请重新提交申请');
      }
    } else {
      setError('未找到申请信息，请先提交贷款申请');
    }
    setIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // 使用申请ID进行确认
      const response = await confirmLoanApplication(applicationData.id || 'default-id');
      if (response.success) {
        // 保存确认后的信息，然后跳转到结果页面
        localStorage.setItem('loanResult', JSON.stringify(response.data));
        window.location.href = '/loan-result';
      } else {
        alert('确认申请失败：' + response.message);
      }
    } catch (err) {
      console.error('确认申请出错:', err);
      alert('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    // 根据贷款类型返回相应的申请页面
    const loanType = applicationData?.type || 'individual';
    window.location.href = loanType === 'corporate' ? 
      '/corporation-loan-application' : 
      '/individual-loan-application';
  };

  if (isLoading) {
    return (
      <BaseLayout title="贷款信息确认">
        <div className="loading">加载中...</div>
      </BaseLayout>
    );
  }

  if (error || !applicationData) {
    return (
      <BaseLayout title="贷款信息确认">
        <div className="error-message">
          {error || '申请信息不存在'}
          <button onClick={() => window.location.href = '/'}>返回首页</button>
        </div>
      </BaseLayout>
    );
  }

  // 根据贷款类型渲染不同的确认信息
  const isCorporateLoan = applicationData.type === 'corporate';

  return (
    <BaseLayout title="贷款信息确认">
      <div className="loan-information-confirmation">
        <h2>贷款申请信息确认</h2>
        
        <div className="confirmation-card">
          {isCorporateLoan ? (
            // 企业贷款信息
            <>
              <div className="info-section">
                <h3>企业基本信息</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">公司名称：</span>
                    <span className="value">{applicationData.companyName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">营业执照号：</span>
                    <span className="value">{applicationData.businessLicenseNo || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">经营地址：</span>
                    <span className="value">{applicationData.businessAddress || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">法人姓名：</span>
                    <span className="value">{applicationData.legalPersonName || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">法人身份证号：</span>
                    <span className="value">{applicationData.legalPersonId || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">成立年份：</span>
                    <span className="value">{applicationData.establishmentYear || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">所属行业：</span>
                    <span className="value">{applicationData.industry || '-'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 个人贷款信息
            <>
              <div className="info-section">
                <h3>个人基本信息</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">姓名：</span>
                    <span className="value">{applicationData.name || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">身份证号：</span>
                    <span className="value">{applicationData.idNumber || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">手机号码：</span>
                    <span className="value">{applicationData.phoneNumber || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">居住地址：</span>
                    <span className="value">{applicationData.address || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">年龄：</span>
                    <span className="value">{applicationData.age || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">婚姻状况：</span>
                    <span className="value">{applicationData.maritalStatus || '-'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>工作信息</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">工作单位：</span>
                    <span className="value">{applicationData.employer || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">职位：</span>
                    <span className="value">{applicationData.position || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">工作年限：</span>
                    <span className="value">{applicationData.workYears || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">月收入：</span>
                    <span className="value">{applicationData.monthlyIncome || '-'}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="info-section">
            <h3>贷款信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">贷款金额：</span>
                <span className="value">{applicationData.loanAmount || '-'} 元</span>
              </div>
              <div className="info-item">
                <span className="label">贷款期限：</span>
                <span className="value">{applicationData.loanTerm || '-'} 个月</span>
              </div>
              <div className="info-item">
                <span className="label">贷款用途：</span>
                <span className="value">{applicationData.loanPurpose || '-'}</span>
              </div>
              {isCorporateLoan && (
                <>
                  <div className="info-item">
                    <span className="label">月均收入：</span>
                    <span className="value">{applicationData.monthlyRevenue || '-'} 元</span>
                  </div>
                  <div className="info-item">
                    <span className="label">财务状况：</span>
                    <span className="value">{applicationData.financialStatus || '-'}</span>
                  </div>
                </>
              )}
              <div className="info-item">
                <span className="label">抵押物类型：</span>
                <span className="value">{applicationData.collateralType || '-'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>材料信息</h3>
            <div className="info-grid">
              {isCorporateLoan ? (
                <>
                  <div className="info-item">
                    <span className="label">营业执照：</span>
                    <span className="value">已上传</span>
                  </div>
                  <div className="info-item">
                    <span className="label">财务报表：</span>
                    <span className="value">已上传</span>
                  </div>
                  <div className="info-item">
                    <span className="label">税务证明：</span>
                    <span className="value">已上传</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-item">
                    <span className="label">身份证正面：</span>
                    <span className="value">已上传</span>
                  </div>
                  <div className="info-item">
                    <span className="label">身份证反面：</span>
                    <span className="value">已上传</span>
                  </div>
                  <div className="info-item">
                    <span className="label">收入证明：</span>
                    <span className="value">已上传</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="confirmation-note">
          <h4>确认说明：</h4>
          <ul>
            <li>请仔细核对上述信息，确保准确无误</li>
            <li>提交确认后，系统将进行贷款风险评估</li>
            <li>评估结果将在短时间内通过页面展示</li>
            <li>如有信息错误，请点击"修改"按钮返回修改</li>
          </ul>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="edit-button"
            onClick={handleEdit}
          >
            修改
          </button>
          <button 
            type="button" 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '确认中...' : '确认提交'}
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoanInformationConfirmation;