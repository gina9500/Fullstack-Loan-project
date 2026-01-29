// 个人贷款结果页面
import React from 'react';
import './personal-loan-result.css';

const PersonalLoanResult = () => {
  // 模拟数据
  const reservationNumber = "12098833122";

  return (
    <div className="personal-result-container">
      <div className="personal-result-content">
        <h1 className="section-title">个人入力画面 - 预定结果</h1>
        
        <div className="result-title">
          <span className="english-title">Individual Loan Application</span>
          <span className="success-label">预定成功</span>
        </div>
        
        <div className="result-message">
          <p>您已经成功预定期评，</p>
          <p className="reservation-number">
            预定号: <span className="number">{reservationNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalLoanResult;