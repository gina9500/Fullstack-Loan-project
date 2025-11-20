// 企业入力页面
import React, { useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import InputField from '../components/form/InputField';
import SelectField from '../components/form/SelectField';
import FileUploadField from '../components/form/FileUploadField';
import { submitCorporationLoan } from '../api/loan';
import './corporation-loan-application.css';

/**
 * 企业入力页面组件
 * 负责处理企业贷款申请表单的所有功能，数据收集、验证和提交
 */
const CorporationLoanApplication = () => {
  
  // 表单数据初始化所有表单字段为默认值
  const [formData, setFormData] = useState({
    entName: '',            // 企业名称
    uscc: '',               // 统一社会信用代码
    companyEmail: '',       // 企业邮箱
    companyAddress: '',     // 企业地址
    repayAccountBank: '',   // 还款账户银行
    repayAccountNo: '',     // 还款账户号码
    loanAmount: '',         // 贷款金额
    loanTerm: '',           // 贷款期限
    loanPurpose: '',        // 贷款用途
    propProofType: '',      // 财产证明类型
    industryCategory: '',   // 行业类别
    businessLicenseFile: null,      // 营业执照文件
    financialReportFile: null,      // 财务报表文件
    taxCertificateFile: null,       // 税务证明文件
    propProofDocs: null             // 财产证明文件
  });

  // 表单验证错误信息状态管理
  const [errors, setErrors] = useState({});
  // 表单提交状态 - 用于显示提交中的加载状态
  const [isSubmitting, setIsSubmitting] = useState(false);

    /**
   * 处理表单输入变化
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // 当用户修改输入字段时更新表单数据，并清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * 处理文件上传
   */
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

   /**
   * 表单验证函数
   * 验证所有必填字段和格式要求，设置错误信息并返回验证结果
   */
  const validateForm = () => {
    const newErrors = {};
    
    // 必填字段验证
    if (!formData.entName.trim()) newErrors.entName = 'Company name is required';
    if (!formData.uscc.trim()) newErrors.uscc = 'Unified Social Credit Code is required';
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Company email is required';
    if (!formData.repayAccountBank) newErrors.repayAccountBank = 'Please select your repay account bank';
    if (!formData.repayAccountNo.trim()) newErrors.repayAccountNo = 'Account number is required';
    // 验证账户号码为19位数字
    if (formData.repayAccountNo && !/^\d{19}$/.test(formData.repayAccountNo)) {
      newErrors.repayAccountNo = 'Account number must be 19 digits';
    }
    // 验证邮箱格式
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    // 贷款信息验证
    if (!formData.loanAmount.trim()) newErrors.loanAmount = 'Loan amount is required';
    if (formData.loanAmount && (!/^\d+(\.\d{1,2})?$/.test(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0)) {
      newErrors.loanAmount = 'Please enter a valid positive number';
    }
    if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
    if (!formData.propProofType) newErrors.propProofType = 'Property proof type is required';
    if (!formData.propProofDocs) newErrors.propProofDocs = 'Property proof document is required';

    // 如果没有错误，返回true表示验证通过
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    /**
   * 处理表单提交
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 由于没有后端API，模拟保存表单数据到localStorage并跳转到确认页面
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
      
      localStorage.setItem('loanApplication', JSON.stringify(serializableData));
      
      // 跳转到确认页面
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

  // 行业类别选项
  const industryCategoryOptions = [
    { value: 'agriculture', label: '农林牧渔' },
    { value: 'chemical', label: '基础化工' },
    { value: 'nonbanking', label: '非银金融' }
  ];

  // 贷款期限选项
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

  // 贷款用途选项
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
  
  // 还款账户银行选项
  const bankOptions = [
    { value: 'bank_of_china', label: '中国银行' },
    { value: 'icbc', label: '工商银行' },
    { value: 'cmb', label: '招商银行' }
  ];

  // 组件渲染
  return (
    <BaseLayout title="Corporation Loan Application">
      <div className="corporation-loan-application">
        <h2>Corporation Loan Application</h2>
        <form onSubmit={handleSubmit}>
          {/* 基本信息部分 */}
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

          {/* 贷款信息部分 */}
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