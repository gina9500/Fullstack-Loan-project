// 企业入力页面
import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import InputField from '../components/form/InputField';
import SelectField from '../components/form/SelectField';
import FileUploadField from '../components/form/FileUploadField';
import { checkCorporationLoan } from '../api/loan';
import './corporation-loan-application.css';


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
    propProofDocs: null,    // 财产证明文件（JSON文件）
    propProofDocsName: '',  // 财产证明文件名
  });

// 从localStorage恢复数据的useEffect
useEffect(() => {
  // 尝试从localStorage恢复数据，如果存在retainData标记
  const savedData = localStorage.getItem('loanApplication');
  const retainDataFlag = localStorage.getItem('retainData');

  console.log('savedData:', savedData);
  console.log('retainDataFlag:', retainDataFlag);

  if (savedData && retainDataFlag === 'true') {
    try {
      const parsedData = JSON.parse(savedData);
      console.log('解析后的数据:', parsedData);
      
      // 尝试多种数据结构提取表单数据
      let formDataToRestore = {};
      let restoredFileName = '';
      
      // 首先专门提取文件名，检查所有可能的位置
      // 检查顶层
      if (parsedData.propProofDocsName) {
        restoredFileName = parsedData.propProofDocsName;
      }
      // 检查formData中
      else if (parsedData.formData && parsedData.formData.propProofDocsName) {
        restoredFileName = parsedData.formData.propProofDocsName;
      }
      // 检查data中
      else if (parsedData.data && parsedData.data.propProofDocsName) {
        restoredFileName = parsedData.data.propProofDocsName;
      }
      // 检查data.formData中
      else if (parsedData.data && parsedData.data.formData && parsedData.data.formData.propProofDocsName) {
        restoredFileName = parsedData.data.formData.propProofDocsName;
      }
      
      console.log('专门提取的文件名:', restoredFileName);
      
      // 提取表单数据
      // 1: 数据直接在顶层
      if (parsedData.entName || parsedData.uscc) {
        formDataToRestore = parsedData;
      }
      // 2: 数据在formData字段中
      else if (parsedData.formData) {
        formDataToRestore = parsedData.formData;
      }
      // 3: 数据在data字段中
      else if (parsedData.data) {
        formDataToRestore = parsedData.data;
      }
      // 4: 数据在data.formData字段中
      else if (parsedData.data && parsedData.data.formData) {
        formDataToRestore = parsedData.data.formData;
      }
      
      console.log('要恢复的数据:', formDataToRestore);
      
      // 只恢复表单中定义的字段
      const validFormData = Object.keys(formData).reduce((acc, key) => {
        if (formDataToRestore[key] !== undefined) {
          acc[key] = formDataToRestore[key];
        }
        return acc;
      }, {});
      
      console.log('过滤后的有效数据:', validFormData);
      
      // 恢复表单数据，确保文件名被正确设置
      setFormData(prev => ({
        ...prev,
        ...validFormData,
        propProofDocsName: restoredFileName
      }));
      
      console.log('数据恢复完成，文件名:', restoredFileName);
      
      // 清除retainData标记，因为数据已经恢复
      localStorage.removeItem('retainData');
      console.log('数据恢复完成');
    } catch (err) {
      console.error('解析保存的数据失败:', err);
    }
  }  else {
    console.log('没有找到需要恢复的数据');
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

    // 当用户修改输入字段时更新表单数据
    // 并清除对应字段的错误信息
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
  
  // 修改为接受JSON文件而不是Excel文件
  if (name === 'propProofDocs' && file) {
    // 只检查文件扩展名是否为.json
    if (!file.name.endsWith('.json')) {
      alert('请上传JSON文件(.json格式)');
      return;
    }
    
    // 直接保存文件，不进行前端解析
    setFormData(prev => ({
      ...prev,
      [name]: file,
      propProofDocsName: file.name
    }));
  } else {
    // 其他文件类型的处理
    setFormData(prev => ({
      ...prev,
      [name]: file,
      propProofDocsName: file ? file.name : ''
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
    if (!formData.repayAccountNo) newErrors.repayAccountNo = 'Account number is required';
    // 验证还款账户号码为19位数字
    if (formData.repayAccountNo && !/^\d{19}$/.test(formData.repayAccountNo)) {
      newErrors.repayAccountNo = 'Account number must be 19 digits';
    }
    // 验证邮箱格式
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    // 验证贷款申请金额(非负数)
    if (formData.loanAmount === '') newErrors.loanAmount = 'Loan amount is required';
    if (formData.loanAmount && (!/^(?:0(?:\.\d{1,2})?|[1-9]\d*(?:\.\d{1,2})?)$/.test(formData.loanAmount) || parseFloat(formData.loanAmount) < 0)) {
      newErrors.loanAmount = 'Please enter a valid non-negative number';
    }
    // 必填字段验证
    if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
    if (!formData.propProofType) newErrors.propProofType = 'Property proof type is required';
    // 文件验证：必须上传实际文件对象才能提交
    // 当用户返回页面时，文件名会显示但文件对象已丢失，需要重新上传
    if (!formData.propProofDocs) {
      // 如果有文件名显示但没有文件对象，提示用户重新上传
      if (formData.propProofDocsName) {
        newErrors.propProofDocs = `请重新上传财务数据文件: ${formData.propProofDocsName}`;
      } else {
        newErrors.propProofDocs = 'Property proof document is required';
      }
    }
    // 如果没有错误，返回true表示验证通过
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 /**
  * 表单提交
  */
const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  setIsSubmitting(true);

  try {
    // 要发送的数据（排除文件）
    const dataToSend = {
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
      industryCategory: formData.industryCategory || ''
    };
    
    // 调用API，传入数据对象和文件
    const response = await checkCorporationLoan(dataToSend, formData.propProofDocs);
    
    console.log('后端返回响应:', response);

if (response.success) {
  // 保存验证通过后的数据到localStorage用于确认页面显示
  const baseData = response.data || formData;
  const savedData = {
    ...baseData,
    propProofDocsName: formData.propProofDocs?.name || baseData.propProofDocsName || null
  };
  localStorage.setItem('loanApplication', JSON.stringify(savedData));
  
  // 设置retainData标记，用于指示需要保留数据
  localStorage.setItem('retainData', 'true');
  
  // 跳转到确认页面
  window.location.href = '/loan-information-confirmation';
} else {
      // 处理后端返回的错误信息
      const newErrors = {};
      
      // 添加（参数校验失败）错误信息
      if (response.message) {
        newErrors.check = response.message;
      }
      
      // 添加各字段的错误信息
      if (response.data.fieldErrors) {
        Object.assign(newErrors, response.data.fieldErrors);
      } 
      
      // 更新错误状态
      setErrors(newErrors);
    }
    
  } catch (error) {
    setErrors({ check: '检查失败' });
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
              label="Property Proof Document (JSON format)"
              name="propProofDocs"
              onChange={(e) => handleFileChange('propProofDocs', e)}
              error={errors.propProofDocs}
              required
              initialFileName={formData.propProofDocsName}
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

          {/* 后端检查结果错误信息显示 */}
          {errors.check && (
            <div className="error-message-check">{errors.check}</div>
          )}

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