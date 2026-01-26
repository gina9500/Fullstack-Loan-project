import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PersonalLoanApplication from '../pages/personal-loan-application';
import CorporationLoanApplication from '../pages/corporation-loan-application';
import LoanInformationConfirmation from '../pages/loan-information-confirmation';
import LoanResult from '../pages/loan-result';

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
    'loginError',
    'lastVisitedPath',
    'currentPage'
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
 * 检查页面跳转是否合法
 * @param {string} currentPath - 当前访问的路径
 * @param {Object} location - 路由位置对象
 * @returns {boolean} - true表示合法跳转，false表示不合法跳转
 */
const checkNavigationValid = (currentPath, location) => {
  // 定义页面跳转规则
  const navigationRules = {
    // 正向跳转：入力→确认→结果（只允许按钮点击）
    forward: [
      '/corporation-loan-application',
      '/loan-information-confirmation', 
      '/loan-result'
    ],
    // 反向跳转：结果→确认→入力（允许按钮点击和直接输入URL）
    backward: [
      '/loan-result',
      '/loan-information-confirmation',
      '/corporation-loan-application'
    ]
  };

  // 检查是否是通过按钮跳转（通过state传递）
  const isButtonNavigation = location.state && location.state.fromButton === true;

  // 按钮点击：允许正向和反向跳转
  if (isButtonNavigation) {
    console.log('按钮点击跳转，允许所有方向');
    return true;
  }

  // 直接输入URL：只允许反向跳转
  console.log('直接输入URL，检查是否允许反向跳转');
  
  // 获取来源页面（从localStorage）
  const lastVisitedPath = localStorage.getItem('lastVisitedPath');
  
  console.log('Last visited path:', lastVisitedPath);
  console.log('Current path:', currentPath);
  
  // 如果没有来源页面信息，说明是首次访问
  if (!lastVisitedPath) {
    // 首次访问只允许访问入力页面
    if (currentPath === '/corporation-loan-application') {
      console.log('首次访问，允许访问入力页面');
      return true;
    } else {
      console.log('首次访问，不允许访问非入力页面');
      return false;
    }
  }
  
  // 检查来源页面和当前页面在路径数组中的索引
  const lastIndex = navigationRules.forward.indexOf(lastVisitedPath);
  const currentIndex = navigationRules.forward.indexOf(currentPath);
  
  // 如果来源页面或当前页面不在正向路径数组中，允许访问
  if (lastIndex === -1 || currentIndex === -1) {
    console.log('来源页面或当前页面不在正向路径数组中，允许访问');
    return true;
  }
  
  // 直接输入URL：只允许反向跳转（当前页面索引 <= 来源页面索引）
  if (currentIndex <= lastIndex) {
    console.log('直接输入URL，检测到反向跳转，允许访问');
    return true;
  } else {
    console.log('直接输入URL，检测到正向跳转，禁止访问');
    return false;
  }
};

/**
 * 根据路径渲染对应的页面组件
 * @param {string} path - 页面路径
 * @param {string} userRole - 用户角色
 * @returns {React.Component} - 页面组件
 */
const renderPageByPath = (path, userRole) => {
  switch (path) {
    case '/corporation-loan-application':
      return <CorporationLoanApplication />;
    case '/loan-information-confirmation':
      return <LoanInformationConfirmation />;
    case '/loan-result':
      return <LoanResult />;
    default:
      // 默认返回用户的默认页面
      if (userRole.includes('per')) {
        return <PersonalLoanApplication />;
      } else if (userRole.includes('corp')) {
        return <CorporationLoanApplication />;
      }
      return null;
  }
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
  const [isNavValid, setIsNavValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const errorContainerRef = useRef(null);

  // 保存当前页面到localStorage
  useEffect(() => {
    // 只有在导航验证通过后，才更新当前页面
    if (isNavValid) {
      localStorage.setItem('currentPage', location.pathname);
      console.log('保存当前页面到localStorage:', location.pathname);
    }
  }, [isNavValid, location.pathname]);

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
          
          // 检查页面跳转是否合法
          const navigationValid = checkNavigationValid(location.pathname, location);
          setIsNavValid(navigationValid);
          
          if (!navigationValid) {
            console.log('页面跳转不合法，显示错误提示');
          } else {
            // 只有在导航验证通过后，才保存当前路径到localStorage作为上次访问路径
            localStorage.setItem('lastVisitedPath', location.pathname);
            console.log('保存当前路径到localStorage作为上次访问路径:', location.pathname);
          }
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
  }, [allowedRoles, location.pathname, location]);

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

  // 如果角色不匹配，显示错误提示
  if (hasError) {
    return (
      <>
        <div 
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
          角色不匹配，无法访问该页面
        </div>
        {getDefaultPage()}
      </>
    );
  }

  // 如果页面跳转不合法，显示错误提示并保持在原页面
  if (!isNavValid) {
    console.log('显示不合法路径错误提示');
    
    // 获取用户原来的页面
    const originalPath = localStorage.getItem('lastVisitedPath') || '/corporation-loan-application';
    
    console.log('保持在原页面:', originalPath);
    
    return (
      <>
        <div 
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
          不合法路径
        </div>
        {/* 渲染用户原来的页面，保持用户当前页面状态 */}
        {renderPageByPath(originalPath, userRole)}
      </>
    );
  }

  // Token有效、角色匹配且跳转合法，正常渲染请求的组件
  return element;
};

export default PrivateRoute;