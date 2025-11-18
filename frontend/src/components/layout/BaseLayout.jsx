// 基础布局组件
import React from 'react';
import './base-layout.css';

const BaseLayout = ({ children }) => {
  return (
    <div className="base-layout">
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;