import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import IndividualLoanApplication from '../pages/individual_loan_application';
import CorporationLoanApplication from '../pages/corporation_loan_application';
import LoanInformationConfirmation from '../pages/loan_information_confirmation';
import LoanResult from '../pages/loan_result';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/individual-loan-application" element={<IndividualLoanApplication />} />
        <Route path="/corporation-loan-application" element={<CorporationLoanApplication />} />
        <Route path="/loan-information-confirmation" element={<LoanInformationConfirmation />} />
        <Route path="/loan-result" element={<LoanResult />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;