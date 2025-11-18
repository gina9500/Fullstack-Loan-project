// 贷款结果页面
import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import './loan-result.css';

const LoanResult = () => {
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 从localStorage获取结果信息
    const savedData = localStorage.getItem('loanResult');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResultData(parsedData);
      } catch (err) {
        console.error('解析结果数据失败:', err);
        setError('获取贷款结果失败');
      }
    } else {
      // 模拟数据（实际应用中应该从API获取）
      const mockData = {
        applicationId: 'LN202401150001',
        decision: 'approved', // approved, rejected, pending
        loanAmount: 100000,
        monthlyPayment: 3200,
        interestRate: 0.065,
        loanTerm: 36,
        riskLevel: 'medium',
        riskScore: 680,
        approvalDate: new Date().toLocaleDateString(),
        message: '恭喜！您的贷款申请已通过审核',
        riskFactors: [
          { factor: '信用记录', score: 85, description: '信用记录良好' },
          { factor: '收入稳定性', score: 72, description: '收入来源稳定' },
          { factor: '债务比率', score: 65, description: '债务水平适中' },
          { factor: '抵押物价值', score: 78, description: '抵押物价值充足' }
        ],
        paymentSchedule: [
          { month: 1, payment: 3200, principal: 2658, interest: 542 },
          { month: 2, payment: 3200, principal: 2672, interest: 528 },
          { month: 3, payment: 3200, principal: 2686, interest: 514 },
          { month: 4, payment: 3200, principal: 2700, interest: 500 },
          { month: 5, payment: 3200, principal: 2714, interest: 486 },
          { month: 6, payment: 3200, principal: 2728, interest: 472 }
        ]
      };
      setResultData(mockData);
    }
    setIsLoading(false);
  }, []);

  const handleDownloadReport = () => {
    alert('报告下载功能待实现');
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <BaseLayout title="贷款申请结果">
        <div className="loading">正在分析您的贷款申请...</div>
      </BaseLayout>
    );
  }

  if (error || !resultData) {
    return (
      <BaseLayout title="贷款申请结果">
        <div className="error-message">
          {error || '无法获取贷款结果'}
          <button onClick={handleHome}>返回首页</button>
        </div>
      </BaseLayout>
    );
  }

  const { decision, riskLevel, riskScore } = resultData;
  const isApproved = decision === 'approved';
  const isRejected = decision === 'rejected';
  const isPending = decision === 'pending';

  // 获取风险等级对应的样式类和颜色
  const getRiskLevelClass = () => {
    switch (riskLevel) {
      case 'low':
        return { className: 'risk-low', color: '#27ae60' };
      case 'medium':
        return { className: 'risk-medium', color: '#f39c12' };
      case 'high':
        return { className: 'risk-high', color: '#e74c3c' };
      default:
        return { className: 'risk-medium', color: '#f39c12' };
    }
  };

  const riskClass = getRiskLevelClass();

  return (
    <BaseLayout title="贷款申请结果">
      <div className="loan-result">
        {/* 结果头部 */}
        <div className={`result-header ${isApproved ? 'approved' : isRejected ? 'rejected' : 'pending'}`}>
          <div className="result-status">
            <h2>
              {isApproved ? '贷款申请已通过' : 
               isRejected ? '贷款申请未通过' : '贷款申请处理中'}
            </h2>
            <p className="result-message">{resultData.message}</p>
          </div>
          <div className="application-info">
            <div className="info-item">
              <span className="label">申请编号：</span>
              <span className="value">{resultData.applicationId}</span>
            </div>
            {isApproved && (
              <div className="info-item">
                <span className="label">批准日期：</span>
                <span className="value">{resultData.approvalDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 贷款详情 */}
        {isApproved && (
          <div className="result-section loan-details">
            <h3>贷款详情</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">贷款金额</span>
                <span className="detail-value">¥{resultData.loanAmount.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">月还款额</span>
                <span className="detail-value">¥{resultData.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">年利率</span>
                <span className="detail-value">{(resultData.interestRate * 100).toFixed(2)}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">贷款期限</span>
                <span className="detail-value">{resultData.loanTerm}个月</span>
              </div>
            </div>
          </div>
        )}

        {/* 风险评估 */}
        <div className="result-section risk-assessment">
          <h3>风险评估信息</h3>
          <div className="risk-overview">
            <div className="risk-score">
              <span className="score-label">风险评分</span>
              <div className={`score-value ${riskClass.className}`} style={{ color: riskClass.color }}>
                {riskScore}
              </div>
            </div>
            <div className="risk-level">
              <span className="level-label">风险等级</span>
              <div className={`level-value ${riskClass.className}`} style={{ backgroundColor: riskClass.color }}>
                {riskLevel === 'low' ? '低风险' : 
                 riskLevel === 'medium' ? '中等风险' : '高风险'}
              </div>
            </div>
          </div>
          
          <div className="risk-factors">
            <h4>风险因素分析</h4>
            <div className="factors-list">
              {resultData.riskFactors.map((factor, index) => (
                <div key={index} className="factor-item">
                  <div className="factor-header">
                    <span className="factor-name">{factor.factor}</span>
                    <span className="factor-score">{factor.score}/100</span>
                  </div>
                  <div className="factor-bar-container">
                    <div 
                      className="factor-bar" 
                      style={{ 
                        width: `${factor.score}%`,
                        backgroundColor: factor.score >= 80 ? '#27ae60' : 
                                        factor.score >= 60 ? '#f39c12' : '#e74c3c'
                      }}
                    ></div>
                  </div>
                  <div className="factor-description">{factor.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 还款计划 */}
        {isApproved && resultData.paymentSchedule && (
          <div className="result-section payment-schedule">
            <h3>还款计划（前6期）</h3>
            <div className="schedule-table">
              <table>
                <thead>
                  <tr>
                    <th>期数</th>
                    <th>还款金额</th>
                    <th>本金</th>
                    <th>利息</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.paymentSchedule.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.month}</td>
                      <td>¥{payment.payment.toLocaleString()}</td>
                      <td>¥{payment.principal.toLocaleString()}</td>
                      <td>¥{payment.interest.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="result-actions">
          <button 
            className="download-button"
            onClick={handleDownloadReport}
          >
            下载详细报告
          </button>
          <button 
            className="home-button"
            onClick={handleHome}
          >
            返回首页
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoanResult;