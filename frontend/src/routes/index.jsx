import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import PersonalLoanApplication from '../pages/personal-loan-application';
import CorporationLoanApplication from '../pages/corporation-loan-application';
import LoanInformationConfirmation from '../pages/loan-information-confirmation';
import LoanResult from '../pages/loan-result';

// 路由配置
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/personal-loan-application" element={<PersonalLoanApplication />} />
        <Route path="/corporation-loan-application" element={<CorporationLoanApplication />} />
        <Route path="/loan-information-confirmation" element={<LoanInformationConfirmation />} />
        <Route path="/loan-result" element={<LoanResult />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;