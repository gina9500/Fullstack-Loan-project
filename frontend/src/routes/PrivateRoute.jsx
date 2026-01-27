import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { clearAllStorageData } from '../utils/storageUtils'; // ← 新增
import PersonalLoanApplication from '../pages/personal-loan-application';
import CorporationLoanApplication from '../pages/corporation-loan-application';
import LoanInformationConfirmation from '../pages/loan-information-confirmation';
import LoanResult from '../pages/loan-result';
import { get } from '../utils/request';

const parseJwt = (token) => {
  try {
    if (!token || token.split('.').length !== 3) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT token失败:', error);
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  if (!decodedToken.exp) return false;
  return Date.now() / 1000 > decodedToken.exp;
};

const checkNavigationValid = (currentPath, location, userRole) => {
  const pageRoleRules = {
    '/personal-loan-application': 'per',
    '/corporation-loan-application': 'corp',
    '/loan-information-confirmation': 'corp',
    '/loan-result': 'corp'
  };
  const requiredRole = pageRoleRules[currentPath];
  if (requiredRole && !userRole.includes(requiredRole)) {
    return false;
  }

  const isButtonNavigation = location.state && location.state.fromButton === true;
  if (isButtonNavigation) return true;

  const lastVisitedPath = localStorage.getItem('lastVisitedPath');
  if (!lastVisitedPath) {
    return (userRole.includes('per') && currentPath === '/personal-loan-application') ||
           (userRole.includes('corp') && currentPath === '/corporation-loan-application');
  }

  const navigationRules = ['/corporation-loan-application', '/loan-information-confirmation', '/loan-result'];
  const lastIndex = navigationRules.indexOf(lastVisitedPath);
  const currentIndex = navigationRules.indexOf(currentPath);
  if (lastIndex === -1 || currentIndex === -1) return true;
  return currentIndex <= lastIndex;
};

const renderPageByPath = (path, userRole) => {
  switch (path) {
    case '/personal-loan-application': return <PersonalLoanApplication />;
    case '/corporation-loan-application': return <CorporationLoanApplication />;
    case '/loan-information-confirmation': return <LoanInformationConfirmation />;
    case '/loan-result': return <LoanResult />;
    default:
      return userRole.includes('per') ? <PersonalLoanApplication /> : <CorporationLoanApplication />;
  }
};

const PrivateRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [isNavValid, setIsNavValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  // 保存当前页面
  useEffect(() => {
    if (isNavValid) {
      localStorage.setItem('currentPage', location.pathname);
    }
  }, [isNavValid, location.pathname]);

  // 主验证逻辑
  useEffect(() => {
    const validateTokenAndRole = () => {
      const token = localStorage.getItem('token');
      const userInfoStr = localStorage.getItem('userInfo');

      if (!token || isTokenExpired(token) || !userInfoStr) {
        clearAllStorageData();
        localStorage.setItem('loginError', !token ? '请先登录' : '登录状态已失效，请重新登录');
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoStr);
        const role = userInfo.role?.toLowerCase() || '';
        setUserRole(role);

        const isRoleAllowed = allowedRoles.some(ar => role.includes(ar.toLowerCase()));
        setIsValid(true);
        setIsNavValid(isRoleAllowed && checkNavigationValid(location.pathname, location, role));
        if (isRoleAllowed && checkNavigationValid(location.pathname, location, role)) {
          localStorage.setItem('lastVisitedPath', location.pathname);
        }
      } catch (error) {
        clearAllStorageData();
        localStorage.setItem('loginError', '用户信息异常，请重新登录');
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateTokenAndRole();
  }, [allowedRoles, location.pathname, location]);


// Token检测：每3秒校验token是否仍有效
useEffect(() => {
  if (!isValid || !isNavValid || isLoading) return;

  const heartbeat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 自动处理错误和单点登录逻辑
      await get('/auth/validate-token');
      
      // console.log('心跳检测成功，登录状态有效');
    } catch (error) {
      console.warn('心跳检测失败，将重试:', error);
  
    }
  };

  heartbeat(); // 立即检测一次
  const intervalId = setInterval(heartbeat, 3000); // 每3秒一次

  return () => clearInterval(intervalId);
}, [isValid, isNavValid, isLoading]);

  // 加载中
  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 未认证
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // 非法路径
  if (!isNavValid) {
    const originalPath = localStorage.getItem('lastVisitedPath') || 
                        (userRole.includes('per') ? '/personal-loan-application' : '/corporation-loan-application');
    return (
      <>
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          backgroundColor: '#fff1f0', border: '1px solid #ffccc7',
          color: '#cf1322', padding: '12px', textAlign: 'center',
          zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          类似不合法路径
        </div>
        {renderPageByPath(originalPath, userRole)}
      </>
    );
  }

  return element;
};

export default PrivateRoute;