import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PersonalLoanApplication from '../pages/personal-loan-application';
import CorporationLoanApplication from '../pages/corporation-loan-application';

/**
 * 解析JWT token，获取其有效信息
 * @param {string} token - JWT token字符串
 * @returns {Object|null} - 解析后的token信息，如果解析失败返回null
 */
const parseJwt = (token) => {
  try {
    // 确保token格式正确
    if (!token || token.split('.').length !== 3) {
      console.error('Token格式不正确，无法解析');
      return null;
    }
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    console.log('解析token成功:', payload);
    return payload;
  } catch (error) {
    console.error('解析JWT token失败:', error);
    return null;
  }
};

/**
 * 检查token是否已过期
 * @param {string} token - JWT token字符串
 * @returns {boolean} - true表示已过期，false表示未过期
 */
const isTokenExpired = (token) => {
  if (!token) {
    console.log('Token不存在，视为已过期');
    return true;
  }

  const decodedToken = parseJwt(token);
  if (!decodedToken) {
    console.log('Token解析失败，视为已过期');
    return true;
  }

  if (!decodedToken.exp) {
    console.log('Token中没有exp字段，无法检查过期时间');
    // 如果token中没有exp字段，可以根据需求决定是否视为过期
    // 这里暂时视为未过期
    return false;
  }

  // 检查token是否已过期（exp是Unix时间戳，单位为秒）
  const isExpired = Date.now() / 1000 > decodedToken.exp;
  console.log('Token过期检查结果:', isExpired ? '已过期' : '未过期');
  console.log('当前时间:', new Date().toLocaleString());
  console.log('Token过期时间:', new Date(decodedToken.exp * 1000).toLocaleString());
  
  return isExpired;
};

/**
 * 清除所有相关的storage数据
 */
const clearAllStorageData = () => {
  console.log('开始清除所有storage数据...');
  
  // 列出所有需要清除的数据键
  const storageKeys = [
    'token',
    'userInfo',
    'loanApplication',
    'retainData',
    'loginError'
  ];
  
  // 清除每个键
  storageKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`删除storage数据: ${key} = ${localStorage.getItem(key)}`);
      localStorage.removeItem(key);
    }
  });
  
  // 检查是否还有其他相关数据
  console.log('清除后剩余的storage数据键:', Object.keys(localStorage));
  console.log('所有相关storage数据已清除');
};

/**
 * 权限验证路由组件
 * @param {Object} props - 组件属性
 * @param {React.Component} props.element - 要渲染的组件
 * @param {Array} props.allowedRoles - 允许访问的角色列表
 * @returns {React.Component} - 渲染结果
 */
const PrivateRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const errorContainerRef = useRef(null);

  useEffect(() => {
    console.log('开始验证Token和角色');
    
    // 验证Token和角色
    const validateTokenAndRole = () => {
      const token = localStorage.getItem('token');
      const userInfoStr = localStorage.getItem('userInfo');

      console.log('获取到的Token:', token ? token.substring(0, 20) + '...' : '无');
      
      // 检查Token是否存在
      if (!token) {
        console.log('Token不存在，验证失败');
        clearAllStorageData();
        localStorage.setItem('loginError', '请先登录');
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      // 检查Token是否已过期
      if (isTokenExpired(token)) {
        console.log('Token已过期，验证失败');
        
        // 清除所有相关的storage数据
        clearAllStorageData();
        
        // 设置登录错误信息
        localStorage.setItem('loginError', 'Token已过期,请重新登录');
        
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      // 检查用户信息是否存在
      if (!userInfoStr) {
        console.log('用户信息不存在，验证失败');
        clearAllStorageData();
        localStorage.setItem('loginError', '用户信息已失效,请重新登录');
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoStr);
        const role = userInfo.role?.toLowerCase();
        
        setUserRole(role);
        console.log('用户角色:', role);

        // 检查角色是否在允许列表中
        const isRoleAllowed = allowedRoles.some(allowedRole => 
          role.includes(allowedRole.toLowerCase())
        );

        if (isRoleAllowed) {
          console.log('角色在允许列表中，验证通过');
          setIsValid(true);
          setHasError(false);
        } else {
          console.log('角色不在允许列表中，显示错误');
          // 角色不匹配，显示错误但保持在原页面
          setIsValid(true); // Token有效
          setHasError(true);
          console.warn('角色不匹配，无法访问该页面');
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
        clearAllStorageData();
        localStorage.setItem('loginError', '用户信息解析失败,请重新登录');
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateTokenAndRole();
  }, [allowedRoles, location.pathname]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  // Token无效，跳转到登录页面
  if (!isValid) {
    console.log('Token无效，跳转到登录页面');
    return <Navigate to="/login" replace />;
  }

  // 确定用户的默认页面
  const getDefaultPage = () => {
    if (userRole.includes('per')) {
      return <PersonalLoanApplication />;
    } else if (userRole.includes('corp')) {
      return <CorporationLoanApplication />;
    }
  };

  // 如果角色不匹配，始终显示用户的默认页面并添加错误提示
  if (hasError) {
    // 创建一个空的div用于渲染错误提示
    const renderErrorElement = () => {
      return (
        <div 
          ref={errorContainerRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff1f0',
            border: '1px solid #ffccc7',
            borderRadius: '0',
            color: '#cf1322',
            padding: '12px',
            fontSize: '14px',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          类似不合法路径
        </div>
      );
    };

    // 直接渲染默认页面，不添加额外容器
    // 同时渲染错误提示元素
    return (
      <>
        {/* 渲染错误提示 */}
        {renderErrorElement()}
        
        {/* 直接渲染用户的默认页面 - 完全保持原页面结构 */}
        {getDefaultPage()}
      </>
    );
  }

  // Token有效且角色匹配，正常渲染请求的组件
  return element;
};

export default PrivateRoute;