// 贷款结果页面
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import './loan-result.css';

const LoanResult = () => {
  const navigate = useNavigate();

  // 处理重新评估按钮点击事件
  const handleReEvaluation = () => {
    // 记录需要保留的数据标记
    localStorage.setItem('retainData', 'true');
    // 使用React Router导航到企业贷款申请页面，并传递状态信息
    navigate('/corporation-loan-application', { state: { fromButton: true } });
  };

  // 组件渲染
  return (
    <BaseLayout title="Loan Decision Notification">
      <div className="loan-result">
        <div className="decision-container">
          <h1>Risk Information Loan</h1>
          <h2>Decision Notification</h2>

          <div className="info-item">
            <span className="info-label">Risk level</span>
            <div className="risk-level-display">medium</div>
          </div>

          <div className="info-item">
            <span className="info-label">Information</span>
            <div className="information-display">Suggest additional materials.</div>
          </div>

          <div className="button-section">
            <button
              className="re-evaluation-button"
              onClick={handleReEvaluation}
            >
              Re-evaluation
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoanResult;