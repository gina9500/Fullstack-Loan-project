// 个人入力页面
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './personal-loan-application.css';

const PersonalLoanApplication = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加表单验证和数据处理逻辑
    // 跳转到个人贷款结果页面
    navigate('/personal-loan-result');
  };

  return (
      <div className="application-container">
        <div className="application-header">

          <h1 className="application-title">Individual Loan Application</h1>
        </div>
        
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="" />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">Id Number</label>
            <input type="text" id="idNumber" name="idNumber" placeholder="" />
          </div>

          <div className="form-group">
            <label htmlFor="birthday">Birthday</label>
            <input type="text" id="birthday" name="birthday" placeholder="年 / 月 / 日" />
          </div>

          <div className="form-group">
            <label htmlFor="idCardExpiryDate">Id Card Expiry Date</label>
            <input type="text" id="idCardExpiryDate" name="idCardExpiryDate" placeholder="年 / 月 / 日" />
          </div>

          <div className="form-group file-upload">
            <label htmlFor="idCardFront">Id Card Front</label>
            <div className="file-input-container">
              <input type="file" id="idCardFront" name="idCardFront" className="file-input" />

              <span className="file-input-status">未选择任何文件</span>
                <label htmlFor="idCardFront" className="file-input-button">选择文件</label>
            </div>
          </div>

          <div className="form-group file-upload">
            <label htmlFor="idCardBack">Id Card Back</label>
            <div className="file-input-container">
              <input type="file" id="idCardBack" name="idCardBack" className="file-input" />
              <span className="file-input-status">未选择任何文件</span>
                <label htmlFor="idCardBack" className="file-input-button">选择文件</label>
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="mobileNo">Mobile No</label>
            <input type="tel" id="mobileNo" name="mobileNo" placeholder="" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Mail</label>
            <input type="email" id="email" name="email" placeholder="" />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">submit</button>
          </div>
        </form>
      </div>
  );
};

export default PersonalLoanApplication;