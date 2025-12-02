// 登录页面
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/form/InputField';
import { login } from '../api/user';
import './login.css';

/**
 * 登录页面组件
 * 负责处理用户登录、验证和页面跳转逻辑
 */
const Login = () => {
  // 路由钩子，用于登录成功后跳转到相应页面
  const navigate = useNavigate();
  
  // 表单数据状态管理
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  
  // 表单验证错误信息状态
  const [errors, setErrors] = useState({});
  
  // 加载状态，用于显示登录过程中的加载状态
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 处理表单输入变化
   * 当用户输入时更新表单数据状态，并清除对应字段的错误信息
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 清除对应字段的错误信息，当用户重新输入时
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  /**
   * 表单验证函数
   * 验证用户名和密码是否符合要求，设置错误信息并返回验证结果
   */
  const validateForm = () => {
    const newErrors = {};

    // 验证用户名不能为空
    if (!formData.userId.trim()) {
      newErrors.userId = '用户名不能为空';
    }

    // 验证密码规则不能为空、必须为8位英数字且不能是纯数字或纯字母
    if (!formData.password.trim()) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length !== 8) {
      newErrors.password = '密码必须为8位';
    } else if (!/^[A-Za-z0-9]{8}$/.test(formData.password)) {
      newErrors.password = '密码必须为8位英数字';
    } else if (/^\d+$/.test(formData.password)) {
      newErrors.password = '密码不能为纯数字';
    } else if (/^[A-Za-z]+$/.test(formData.password)) {
      newErrors.password = '密码不能为纯字母';
    }

    setErrors(newErrors);
    // 如果没有错误，返回true表示验证通过
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理表单提交
   * 阻止表单默认提交行为，验证表单，调用登录API，并根据结果跳转页面
   */
    const handleSubmit = async (e) => {
    e.preventDefault();

    // 先验证表单，不通过则不进行后续操作
    if (!validateForm()) {
      return;
    }

    // 设置加载状态为true，显示加载提示
    setIsLoading(true);

    try {
      // 调用登录API获取响应
      const response = await login(formData);

      console.log("登录响应:", response);
      
      // 检查API返回的success字段
      if (response && response.success === false) {
        // 如果success为false，显示错误信息并阻止跳转
        setErrors({
          ...errors,
          submit: response.message || '登录失败，请稍后重试'
        });
        return; // 不执行后续代码，阻止跳转
      }
      
      // 只有当success不为false时才进行页面跳转
      // 根据用户名中是否包含'per'来判断是个人用户还是企业用户
      if (response.data.toLowerCase().includes('per')) {
        // 个人用户跳转到个人入力页面
        navigate('/personal-loan-application');
      } else {
        // 企业用户跳转到企业入力页面
        navigate('/corporation-loan-application');
      }
    } catch (error) {
      // 处理API调用错误
      console.error('登录API调用失败:', error);
      setErrors({
        ...errors,
        submit: '网络错误，请检查您的网络连接'
      });
    } finally {
      // 无论成功失败，都在最后将加载状态设为false
      setIsLoading(false);
    }
  };

  // 组件渲染
  return (

      <div className="login-container">
        <h1 className="login-title">Login</h1>
        
        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* 用户ID */}
          <InputField
            label="User id"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="请输入用户名"
            error={errors.userId}
            required
          />
          
          {/* 密码 */}
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

        {/* 后端返回的错误信息 */}
        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}
          
          {/* 登录按钮，加载状态下禁用 */}
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : 'login'}
          </button>
        </form>
      </div>

  );
};

export default Login;