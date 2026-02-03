import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './personal-loan-application.css'; 
import { idCardOCR } from '../api/file';
import { submitPersonalLoan } from '../api/loan';

// 日期格式化函数：将 YYYYMMDD 转换为 YYYY/MM/DD
const formatDate = (dateString) => {
  if (!dateString || dateString.length !== 8) {
    return dateString; // 如果格式不正确，返回原始字符串
  }
  return `${dateString.substring(0, 4)}/${dateString.substring(4, 6)}/${dateString.substring(6, 8)}`;
};

// 日期反格式化函数：将 YYYY/MM/DD 转换为 YYYYMMDD（用于表单提交）
const unformatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.replace(/\//g, '');
};

// 手动输入日期格式化函数：自动添加斜杠分隔符
const formatManualDateInput = (input) => {
  // 移除非数字字符
  const numericValue = input.replace(/\D/g, '');
  
  // 如果输入不足4位，直接返回
  if (numericValue.length <= 4) {
    return numericValue;
  }
  
  // 如果输入不足6位，格式化为 YYYY/MM
  if (numericValue.length <= 6) {
    return `${numericValue.substring(0, 4)}/${numericValue.substring(4)}`;
  }
  
  // 否则格式化为 YYYY/MM/DD
  return `${numericValue.substring(0, 4)}/${numericValue.substring(4, 6)}/${numericValue.substring(6, 8)}`;
};

// 验证身份证号（18位）
const validateIdNumber = (idNumber) => {
  const idRegex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idRegex.test(idNumber);
};

// 验证邮箱格式：包含@符号，不能包含空格，包含至少一个点号
// 点号必须在@符号之后，@符号前后都必须有内容，点号后必须有内容

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号（11位）
const validateMobile = (mobile) => {
  const mobileRegex = /^1[3-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// 验证日期格式（YYYY/MM/DD 或 "长期"）
const validateDate = (date) => {
  // 允许"长期"作为有效输入
  if (date === '长期') {
    return true;
  }
  
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  // 检查日期有效性
  const parts = date.split('/');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  // 检查月份
  if (month < 1 || month > 12) return false;
  
  // 检查天数
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // 检查闰年
  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear && day > 29) return false;
    if (!isLeapYear && day > 28) return false;
  } else if (day > daysInMonth[month - 1]) {
    return false;
  }
  
  return true;
};

const PersonalLoanApplication = () => { 
  const navigate = useNavigate(); 
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontFileName, setFrontFileName] = useState('未选择任何文件');
  const [backFileName, setBackFileName] = useState('未选择任何文件');
  const [recognizing, setRecognizing] = useState(false);
  const [error, setError] = useState('');
  
  // 扩展状态管理，包含所有表单字段
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    birthday: '',
    idCardExpiryDate: '',
    mobileNo: '',
    email: ''
  });
  
  // 字段错误状态
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    idNumber: '',
    birthday: '',
    idCardExpiryDate: '',
    mobileNo: '',
    email: ''
  });

  // 当正反面文件都选择后，自动触发识别
  useEffect(() => {
    if (frontFile && backFile) {
      handleRecognizeIdCard();
    }
  }, [frontFile, backFile]);

  // 处理身份证正面上传
  const handleFrontFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 验证文件类型，只允许jpg
      if (file.type !== 'image/jpeg' && !file.name.toLowerCase().endsWith('.jpg')) {
        setError('请选择jpg格式的文件');
        return;
      }
      setFrontFile(file);
      setFrontFileName(file.name);
      setError('');
    } else {
      setFrontFile(null);
      setFrontFileName('未选择任何文件');
      setError(''); // 不再显示错误信息
    }
  };

  // 处理身份证反面上传
  const handleBackFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 验证文件类型，只允许jpg
      if (file.type !== 'image/jpeg' && !file.name.toLowerCase().endsWith('.jpg')) {
        setError('请选择jpg格式的文件');
        return;
      }
      setBackFile(file);
      setBackFileName(file.name);
      setError('');
    } else {
      setBackFile(null);
      setBackFileName('未选择任何文件');
      setError(''); // 不再显示错误信息
    }
  };

  // 身份证识别功能
  const handleRecognizeIdCard = async () => {
    if (!frontFile || !backFile) {
      return;
    }

    setRecognizing(true);
    setError('');

    try {
      // 使用封装好的API函数
      const response = await idCardOCR(frontFile, backFile);
      
      // 添加详细调试信息
      console.log('完整API响应:', response);
      
      if (response.success) {
        const info = response.data;
        
        // 打印接收到的数据结构
        console.log('识别到的身份证信息:', info);
        
        // 更新表单数据，应用日期格式化
        setFormData(prev => ({
          ...prev,
          name: info.name || '',
          idNumber: info.idNumber || '', // 改为使用idNumber字段
          birthday: formatDate(info.birthDate) || '',
          idCardExpiryDate: formatDate(info.expiryDate) || ''
        }));
        
        // 清除相关字段错误
        setFieldErrors(prev => ({
          ...prev,
          name: '',
          idNumber: '',
          birthday: '',
          idCardExpiryDate: ''
        }));
      } else {
        setError('识别失败: ' + response.message);
      }
    } catch (err) {
      setError('网络错误，请重试: ' + (err.message || ''));
      console.error('Error:', err);
    } finally {
      setRecognizing(false);
    }
  };

  // 处理表单字段变化
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // 特殊处理日期字段的格式化
    if (id === 'birthday' || id === 'idCardExpiryDate') {
      const formattedDate = formatManualDateInput(value);
      setFormData(prev => ({...prev, [id]: formattedDate}));
    } else {
      setFormData(prev => ({...prev, [id]: value}));
    }
    
    // 实时验证
    validateField(id, value);
  };

  // 验证单个字段
  const validateField = (fieldId, value) => {
    let errorMessage = '';
    
    switch (fieldId) {
      case 'name':
        if (!value.trim()) {
          errorMessage = '姓名不能为空';
        }
        break;
      case 'idNumber':
        if (!value.trim()) {
          errorMessage = '身份证号不能为空';
        } else if (!validateIdNumber(value)) {
          errorMessage = '请输入18位有效身份证号';
        }
        break;
      case 'birthday':
        if (!value.trim()) {
          errorMessage = '出生日期不能为空';
        } else if (!validateDate(value)) {
          errorMessage = '请输入有效日期格式(YYYY/MM/DD)';
        }
        break;
      case 'idCardExpiryDate':
        if (!value.trim()) {
          errorMessage = '身份证有效期不能为空';
        } else if (!validateDate(value)) {
          errorMessage = '请输入有效日期格式(YYYY/MM/DD)';
        }
        break;
      case 'mobileNo':
        if (!value.trim()) {
          errorMessage = '手机号不能为空';
        } else if (!validateMobile(value)) {
          errorMessage = '请输入11位有效手机号';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMessage = '邮箱不能为空';
        } else if (!validateEmail(value)) {
          errorMessage = '请输入有效邮箱格式';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({...prev, [fieldId]: errorMessage}));
    return errorMessage === '';
  };

  // 表单验证
  const validateForm = () => {
    let isValid = true;
    
    // 验证所有字段
    Object.keys(formData).forEach(field => {
      const fieldError = validateField(field, formData[field]);
      if (!fieldError) {
        isValid = false;
      }
    });
    
    return isValid;
  };

// 表单提交处理
const handleSubmit = async (e) => {
  e.preventDefault(); 
  setError('');
  
  // 执行表单验证
  if (!validateForm()) {
    setError('请检查表单中的错误并修正后重试');
    return;
  }

  const { name, idNumber, birthday, idCardExpiryDate, mobileNo, email } = formData;

  const formDataToSend = new FormData();
  formDataToSend.append('name', name);
  formDataToSend.append('idnumber', idNumber);
  formDataToSend.append('birthDate', unformatDate(birthday)); // 转换为 YYYYMMDD 格式
  formDataToSend.append('idCardExpiryDate', unformatDate(idCardExpiryDate)); // 转换为 YYYYMMDD 格式
  formDataToSend.append('mobileNo', mobileNo);
  formDataToSend.append('email', email);

  try {
    const response = await submitPersonalLoan(formData);
    
    if (response.success) {
      // 跳转到个人贷款结果页面，并传递预约号
      navigate('/personal-loan-result', { 
        state: { appointmentNo: response.data.appointmentNo } 
      });
    } else {
      setError('提交失败: ' + response.message);
    }
  } catch (err) {
    setError('网络错误，请重试');
    console.error('Error:', err);
  }
};

  return ( 
    <div className="application-container"> 
      <div className="application-header"> 
        <h1 className="application-title">Individual Loan Application</h1> 
      </div> 
      
      <form className="application-form" onSubmit={handleSubmit}> 
        <div className="form-group"> 
          <label htmlFor="name">姓名</label> 
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="" 
            value={formData.name}
            onChange={handleInputChange}
          /> 
          {fieldErrors.name && <div className="per-error-message">{fieldErrors.name}</div>}
        </div> 

        <div className="form-group"> 
          <label htmlFor="idNumber">身份证号</label> 
          <input 
            type="text" 
            id="idNumber" 
            name="idNumber" 
            placeholder="" 
            value={formData.idNumber}
            onChange={handleInputChange}
          /> 
          {fieldErrors.idNumber && <div className="per-error-message">{fieldErrors.idNumber}</div>}
        </div> 

        <div className="form-group"> 
          <label htmlFor="birthday">出生日期</label> 
          <input 
            type="text" 
            id="birthday" 
            name="birthday" 
            placeholder="年 / 月 / 日" 
            value={formData.birthday}
            onChange={handleInputChange}
          /> 
          {fieldErrors.birthday && <div className="per-error-message">{fieldErrors.birthday}</div>}
        </div> 

        <div className="form-group"> 
          <label htmlFor="idCardExpiryDate">身份证有效期</label> 
          <input 
            type="text" 
            id="idCardExpiryDate" 
            name="idCardExpiryDate" 
            placeholder="年 / 月 / 日" 
            value={formData.idCardExpiryDate}
            onChange={handleInputChange}
          /> 
          {fieldErrors.idCardExpiryDate && <div className="per-error-message">{fieldErrors.idCardExpiryDate}</div>}
        </div> 

        <div className="form-group file-upload"> 
          <label htmlFor="idCardFront">身份证正面</label> 
          <div className="file-input-container"> 
            <input 
              type="file" 
              id="idCardFront" 
              name="idCardFront" 
              className="file-input" 
              onChange={handleFrontFileChange}
              accept=".jpg"
            />
            <span className="file-input-status">{frontFileName}</span>
            <label htmlFor="idCardFront" className="file-input-button">选择文件</label> 
          </div> 
        </div> 

        <div className="form-group file-upload"> 
          <label htmlFor="idCardBack">身份证反面</label> 
          <div className="file-input-container"> 
            <input 
              type="file" 
              id="idCardBack" 
              name="idCardBack" 
              className="file-input" 
              onChange={handleBackFileChange}
              accept=".jpg"
            />
            <span className="file-input-status">{backFileName}</span> 
            <label htmlFor="idCardBack" className="file-input-button">选择文件</label> 
          </div> 
        </div> 

        {/* 识别状态显示 */}
        {recognizing && (
          <div className="recognizing-status">
            <p>正在识别身份证信息...</p>
          </div>
        )}

        <div className="form-group"> 
          <label htmlFor="mobileNo">手机号</label> 
          <input 
            type="tel" 
            id="mobileNo" 
            name="mobileNo" 
            placeholder="" 
            value={formData.mobileNo}
            onChange={handleInputChange}
          /> 
          {fieldErrors.mobileNo && <div className="per-error-message">{fieldErrors.mobileNo}</div>}
        </div> 

        <div className="form-group"> 
          <label htmlFor="email">邮箱</label> 
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="" 
            value={formData.email}
            onChange={handleInputChange}
          /> 
          {fieldErrors.email && <div className="per-error-message">{fieldErrors.email}</div>}
        </div> 

        {/* 全局错误信息显示 */}
        {/* {error && <div className="per-error-message">{error}</div>} */}

        <div className="form-actions"> 
          <button type="submit" className="submit-button">提交</button> 
        </div> 

      </form> 
    </div> 
  ); 
}; 

export default PersonalLoanApplication;