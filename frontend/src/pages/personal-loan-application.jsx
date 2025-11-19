// 个人贷款申请页面
import React from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import './personal-loan-application.css';

const PersonalLoanApplication = () => {
  return (
    <BaseLayout>
      <div className="application-container">
        <h1 className="application-title">Personal Loan Application</h1>
        <p className="application-message">此页面仅做跳转展示用</p>
      </div>
    </BaseLayout>
  );
};

export default PersonalLoanApplication;