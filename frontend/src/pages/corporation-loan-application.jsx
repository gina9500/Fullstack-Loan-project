// 企业入力页面
import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import InputField from '../components/form/InputField';
import SelectField from '../components/form/SelectField';
import FileUploadField from '../components/form/FileUploadField';
import { submitCorporationLoan } from '../api/loan';
import './corporation-loan-application.css';
import { parseExcelToJson, isValidExcelFile } from '../utils/excelParser';


/**
 * 企业入力页面组件
 * 负责处理企业贷款表单的所有功能，数据收集、验证和提交
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
    propProofDocs: null,            // 财产证明文件
    financialData: null, // 用于存储解析后的财务数据
    chartMaxValue: 30000000 // 图表最大值
  });

  // 从localStorage恢复数据
  useEffect(() => {
    const savedData = localStorage.getItem('loanApplication');
    if (savedData && localStorage.getItem('retainData') === 'true') {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
        // 清除retainData标记，因为数据已经恢复
        localStorage.removeItem('retainData');
      } catch (err) {
        console.error('解析保存的数据失败:', err);
      }
    }
  }, []);

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
const handleFileChange = async (name, event) => {
  const file = event && event.target && event.target.files ? event.target.files[0] : null;
  console.log('文件上传:', name, '事件类型:', typeof event, '文件对象:', file);
  
  // 如果是财产证明文件且为Excel文件，尝试解析
  if (name === 'propProofDocs' && file && isValidExcelFile(file)) {
    try {
      // 解析Excel文件
      const parsedData = await parseExcelToJson(file);
      
      setFormData(prev => ({
        ...prev,
        [name]: file,
        financialData: parsedData.formattedData,
        chartMaxValue: parsedData.maxValue
      }));
      

    } catch (error) {
      alert('文件解析失败: ' + error.message);
      // 仍然保存文件，但不更新财务数据
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  } else {
    // 其他文件类型的处理
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  }
  
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
    // 验证统一社会信用代码为18位英数字且不能是纯数字或纯字母
    if (formData.uscc && !/^[A-Za-z0-9]{18}$/.test(formData.uscc)) {
      newErrors.uscc = 'Uscc must be 18 characters';
    } else if (formData.uscc && /^\d+$/.test(formData.uscc)) {
      newErrors.uscc = 'Uscc cannot be all numbers';
    } else if (formData.uscc && /^[A-Za-z]+$/.test(formData.uscc)) {
      newErrors.uscc = 'Uscc cannot be all letters';
    }
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Company email is required';
    if (!formData.repayAccountBank) newErrors.repayAccountBank = 'Please select your repay account bank';
    if (!formData.repayAccountNo.trim()) newErrors.repayAccountNo = 'Account number is required';
    // 验证还款账户号码为19位数字
    if (formData.repayAccountNo && !/^\d{19}$/.test(formData.repayAccountNo)) {
      newErrors.repayAccountNo = 'Account number must be 19 digits';
    }
    // 验证邮箱格式
    // 不能包含空格字符/必须包含一个 @ 符号/@ 符号前后必须有内容/必须包含一个点号 (.) /点号前后必须有内容
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    // 验证贷款申请金额(12/2 2nd review bug修正)
    // 规则：数字/整数或小数/如果是小数，最多只能有两位小数/必须大于0/0开头必须有小数点
    if (!formData.loanAmount.trim()) newErrors.loanAmount = 'Loan amount is required';
    if (formData.loanAmount && (!/^(?:0\.\d{1,2}|[1-9]\d*(?:\.\d{1,2})?)$/.test(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0)) {
      newErrors.loanAmount = 'Please enter a valid positive number';
    }
    // 必填字段验证
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

    alert('表单提交被触发！');

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {

      const propProofDocsName = formData.propProofDocs?.name || null;

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
        industryCategory: formData.industryCategory,
        // 添加文件名字段
        propProofDocsName: propProofDocsName,
          // 添加财务数据
      financialData: formData.financialData,
      chartMaxValue: formData.chartMaxValue
      };

      localStorage.setItem('loanApplication', JSON.stringify(serializableData));

      // 设置retainData标记，用于指示需要保留数据
      localStorage.setItem('retainData', 'true');

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

  // 还款账户银行
  const bankOptions = [
    { value: '中国银行', label: '中国银行' },
    { value: '工商银行', label: '工商银行' },
    { value: '招商银行', label: '招商银行' }
  ];

  // 贷款期限
  const loanTermOptions = [
    { value: '6个月', label: '6个月' },
    { value: '1年', label: '1年' },
    { value: '2年', label: '2年' },
    { value: '3年', label: '3年' },
    { value: '5年', label: '5年' },
    { value: '10年', label: '10年' },
    { value: '20年', label: '20年' },
    { value: '30年', label: '30年' }
  ];

  // 贷款目的
  const loanPurposeOptions = [
    { value: '信用贷款', label: '信用贷款' },
    { value: '抵押贷款', label: '抵押贷款' },
    { value: '税贷', label: '税贷' }
  ];

  // 根据贷款目的获取财产证明类型
  const getPropertyProofOptions = () => {
    switch (formData.loanPurpose) {
      case '信用贷款':
        return [
          { value: '营业执照', label: '营业执照' },
          { value: '财务报表', label: '财务报表' },
          { value: '企业信用报告', label: '企业信用报告' },
          { value: '纳税证明', label: '纳税证明' },
          { value: '银行流水', label: '银行流水' }
        ];
      case '抵押贷款':
        return [
          { value: '房产证', label: '房产证' },
          { value: '土地使用权证', label: '土地使用权证' },
          { value: '车辆登记证', label: '车辆登记证' },
          { value: '设备产权证明', label: '设备产权证明' }
        ];
      case '税贷':
        return [
          { value: '纳税申报表', label: '纳税申报表' },
          { value: '纳税凭证', label: '纳税凭证' }
        ];
      default:
        return [];
    }
  };

  // 所属行业
  const industryCategoryOptions = [
    { value: '农林牧渔', label: '农林牧渔' },
    { value: '基础化工', label: '基础化工' },
    { value: '非银金融', label: '非银金融' }
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
                type="number"
                required
                placeholder="19-digit account number"
              />
            </div>
          </div>

          {/* 贷款申请金额 */}
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
              onChange={(e) => handleFileChange('propProofDocs', e)}
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