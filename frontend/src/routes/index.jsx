import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import PersonalLoanApplication from '../pages/personal-loan-application';
import PersonalLoanResult from '../pages/personal-loan-result';
import CorporationLoanApplication from '../pages/corporation-loan-application';
import LoanInformationConfirmation from '../pages/loan-information-confirmation';
import LoanResult from '../pages/loan-result';
import PrivateRoute from './PrivateRoute'; 

// 路由配置
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* 个人用户路由 */}
        <Route 
          path="/personal-loan-application" 
          element={
            <PrivateRoute 
              element={<PersonalLoanApplication />} 
              allowedRoles={['per']} 
            /> 
          } 
        />
        
        {/* 个人贷款结果页面 - 允许个人用户访问 */}
        <Route 
          path="/personal-loan-result" 
          element={
            <PrivateRoute 
              element={<PersonalLoanResult />} 
              allowedRoles={['per']} 
            /> 
          } 
        />
        
        {/* 企业用户路由 */}
        <Route 
          path="/corporation-loan-application" 
          element={
            <PrivateRoute 
              element={<CorporationLoanApplication />} 
              allowedRoles={['corp']} 
            /> 
          } 
        />
        
        {/* 贷款信息确认页面 - 允许企业用户访问 */}
        <Route 
          path="/loan-information-confirmation" 
          element={
            <PrivateRoute 
              element={<LoanInformationConfirmation />} 
              allowedRoles={['corp']} 
            /> 
          } 
        />
        
        {/* 贷款结果页面 - 允许企业用户访问 */}
        <Route 
          path="/loan-result" 
          element={
            <PrivateRoute 
              element={<LoanResult />} 
              allowedRoles={['corp']} 
            /> 
          } 
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;