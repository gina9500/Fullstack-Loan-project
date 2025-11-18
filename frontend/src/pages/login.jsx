// 登录页面
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import InputField from '../components/form/InputField';
import { login } from '../api/user';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 验证用户名
    if (!formData.userId.trim()) {
      newErrors.userId = '用户名不能为空';
    }

    // 验证密码
    if (!formData.password.trim()) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length !== 8) {
      newErrors.password = '密码必须为8位数字';
    } else if (!/^\d+$/.test(formData.password)) {
      newErrors.password = '密码必须为数字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟登录成功，根据用户类型跳转到不同页面
      // 在开发环境中跳过实际API调用，直接进行页面跳转
      // const response = await login(formData);
      
      if (formData.userId.toLowerCase().includes('ind')) {
        // 个人贷款申请页面
        navigate('/individual-loan-application');
      } else {
        // 企业贷款申请页面
        navigate('/corporation-loan-application');
      }
    } catch (error) {
      // 即使API调用失败，也尝试根据用户名进行跳转（用于开发测试）
      console.error('登录API调用失败:', error);
      if (formData.userId.toLowerCase().includes('ind')) {
        navigate('/individual-loan-application');
      } else {
        navigate('/corporation-loan-application');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        
        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            label="User id"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="请输入用户名"
            error={errors.userId}
            required
          />
          
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
            error={errors.password}
            required
          />
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : 'login'}
          </button>
        </form>
      </div>
    </BaseLayout>
  );
};

export default Login;