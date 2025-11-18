// 企业贷款申请页面
import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import InputField from '../components/form/InputField';
import SelectField from '../components/form/SelectField';
import FileUploadField from '../components/form/FileUploadField';
import { submitCorporationLoan } from '../api/loan';
import './corporation-loan-application.css';

const CorporationLoanApplication = () => {
  const [formData, setFormData] = useState({
    entName: '',
    uscc: '',
    companyEmail: '',
    companyAddress: '',
    repayAccountBank: '',
    repayAccountNo: '',
    loanAmount: '',
    loanTerm: '',
    loanPurpose: '',
    propProofType: '',
    industryCategory: '',
    businessLicenseFile: null,
    financialReportFile: null,
    taxCertificateFile: null,
    propProofDocs: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.entName.trim()) newErrors.entName = 'Company name is required';
    if (!formData.uscc.trim()) newErrors.uscc = 'Unified Social Credit Code is required';
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Company email is required';
    if (!formData.repayAccountBank) newErrors.repayAccountBank = 'Please select your repay account bank';
    if (!formData.repayAccountNo.trim()) newErrors.repayAccountNo = 'Account number is required';
    // Validate account number is 19 digits
    if (formData.repayAccountNo && !/^\d{19}$/.test(formData.repayAccountNo)) {
      newErrors.repayAccountNo = 'Account number must be 19 digits';
    }
    // Validate email format
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    
    // Loan information validation
    if (!formData.loanAmount.trim()) newErrors.loanAmount = 'Loan amount is required';
    if (formData.loanAmount && (!/^\d+(\.\d{1,2})?$/.test(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0)) {
      newErrors.loanAmount = 'Please enter a valid positive number';
    }
    if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
    if (!formData.propProofType) newErrors.propProofType = 'Property proof type is required';
    if (!formData.propProofDocs) newErrors.propProofDocs = 'Property proof document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 由于没有后端API，直接保存表单数据到localStorage并跳转到确认页面
      const serializableData = {
        entName: formData.entName,
        uscc: formData.uscc,
        companyEmail: formData.companyEmail,
        companyAddress: formData.companyAddress,
        repayAccountBank: formData.repayAccountBank,
        repayAccountNo: formData.repayAccountNo,
        loanAmount: formData.loanAmount,
        loanTerm: formData.loanTerm,
        loanPurpose: formData.loanPurpose,
        propProofType: formData.propProofType,
        industryCategory: formData.industryCategory
      };
      
      // 保存表单数据到localStorage供确认页面使用
      localStorage.setItem('loanApplication', JSON.stringify(serializableData));
      
      // 直接跳转到确认页面
      window.location.href = '/loan-information-confirmation';
      
      /*
      // 以下是原有的API调用代码，暂时注释掉
      // 模拟提交成功
      const response = await submitCorporationLoan(serializableData);
      // if (response.success) {
      if (true) {
        // Save application info to localStorage for confirmation page
        // localStorage.setItem('loanApplication', JSON.stringify(response.data));
        window.location.href = '/loan-information-confirmation';
      } else {
        alert('Application submission failed: ' + response.message);
      }
      */
    } catch (error) {
      console.error('Error during submission process:', error);
      alert('An error occurred, please try again');
      /*
      console.error('Error submitting application:', error);
      alert('Network error, please try again later');
      */
    } finally {
      setIsSubmitting(false);
    }
  };

  // 生成年份选项
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1950; year--) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  // Industry category options
  const industryCategoryOptions = [
    { value: 'agriculture', label: '农林牧渔' },
    { value: 'chemical', label: '基础化工' },
    { value: 'nonbanking', label: '非银金融' }
  ];

  // Loan term options
  const loanTermOptions = [
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '24', label: '2 years' },
    { value: '36', label: '3 years' },
    { value: '60', label: '5 years' },
    { value: '120', label: '10 years' },
    { value: '240', label: '20 years' },
    { value: '360', label: '30 years' }
  ];

  // Loan purpose options
  const loanPurposeOptions = [
    { value: 'credit', label: '信用贷款' },
    { value: 'mortgage', label: '抵押贷款' },
    { value: 'tax', label: '税贷' }
  ];

  // 根据贷款用途获取财产证明类型选项
  const getPropertyProofOptions = () => {
    switch (formData.loanPurpose) {
      case 'credit':
        return [
          { value: 'business_license', label: '营业执照' },
          { value: 'financial_report', label: '财务报表' },
          { value: 'credit_report', label: '企业信用报告' },
          { value: 'tax_payment', label: '纳税证明' },
          { value: 'bank_flow', label: '银行流水' }
        ];
      case 'mortgage':
        return [
          { value: 'house_property', label: '房产证' },
          { value: 'land_use', label: '土地使用权证' },
          { value: 'vehicle_registration', label: '车辆登记证' },
          { value: 'equipment_property', label: '设备产权证明' }
        ];
      case 'tax':
        return [
          { value: 'tax_return', label: '纳税申报表' },
          { value: 'tax_certificate', label: '纳税凭证' }
        ];
      default:
        return [];
    }
  };
  
  // Bank options for repayment account
  const bankOptions = [
    { value: 'bank_of_china', label: '中国银行' },
    { value: 'icbc', label: '工商银行' },
    { value: 'cmb', label: '招商银行' }
  ];

  return (
    <BaseLayout title="Corporation Loan Application">
      <div className="corporation-loan-application">
        <h2>Corporation Loan Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <InputField
                label="Company Name"
                name="entName"
                value={formData.entName}
                onChange={handleChange}
                error={errors.entName}
                required
                placeholder="Enter company name"
              />
              <InputField
                label="Uscc"
                name="uscc"
                value={formData.uscc}
                onChange={handleChange}
                error={errors.uscc}
                required
                placeholder="18-digit alphanumeric code, e.g., 91310115MA1K4QLXL1"
              />
            </div>
            <div className="form-row">
              <InputField
                label="Company Email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                error={errors.companyEmail}
                required
                placeholder="test@test.com"
              />
            </div>
            <div className="form-row">
              <InputField
                label="Company Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                error={errors.companyAddress}
                placeholder="Enter company address"
              />
            </div>
            <div className="form-row">
              <SelectField
                label="Repay Account Bank"
                name="repayAccountBank"
                value={formData.repayAccountBank}
                onChange={handleChange}
                options={bankOptions}
                error={errors.repayAccountBank}
                required
                placeholder="Please select your repay account!"
              />
              <InputField
                label="Account No"
                name="repayAccountNo"
                value={formData.repayAccountNo}
                onChange={handleChange}
                error={errors.repayAccountNo}
                required
                placeholder="19-digit account number"
              />
            </div>
          </div>

          {/* Loan Information Section */}
          <div className="form-section">
            <h3>Loan Information</h3>
            <div className="form-row">
              <InputField
                label="Loan Amount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                error={errors.loanAmount}
                type="number"
                required
                placeholder="Enter loan amount"
              />
              <SelectField
                label="Loan Term"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleChange}
                options={loanTermOptions}
                error={errors.loanTerm}
                required
                placeholder="Please select your Loan Term!"
              />
            </div>
            <div className="form-row">
              <SelectField
                label="Loan Purpose"
                name="loanPurpose"
                value={formData.loanPurpose}
                onChange={(e) => {
                  handleChange(e);
                  // Reset property proof type when loan purpose changes
                  setFormData(prev => ({
                    ...prev,
                    propProofType: ''
                  }));
                }}
                options={loanPurposeOptions}
                error={errors.loanPurpose}
                required
                placeholder="Please choose your loan Purpose!"
              />
            </div>
            <div className="form-row">
              <SelectField
                label="Property Proof Type (At least one item must be uploaded)"
                name="propProofType"
                value={formData.propProofType}
                onChange={handleChange}
                options={formData.loanPurpose ? getPropertyProofOptions() : []}
                error={errors.propProofType}
                required
                disabled={!formData.loanPurpose}
                placeholder="***Please Select*** ***Unsecured Loan*** ***Property Proof Type***"  
              />
            </div>
            <div className="form-row">
              <FileUploadField
                label="Property Proof Document"
                name="propProofDocs"
                onChange={(file) => handleFileChange('propProofDocs', file)}
                error={errors.propProofDocs}
                required
                placeholder="Please upload your property proof document!"
              />
            </div>
            <div className="form-row">
              <SelectField
                label="Industry Category"
                name="industryCategory"
                value={formData.industryCategory}
                onChange={handleChange}
                options={industryCategoryOptions}
                error={errors.industryCategory}
                placeholder="Please choose your Industry Category!"
              />
            </div>
          </div>

          {/* Document upload section removed as per requirements */}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'apply'}
            </button>
          </div>
        </form>
      </div>
    </BaseLayout>
  );
};

export default CorporationLoanApplication;