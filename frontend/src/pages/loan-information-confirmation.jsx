// 贷款信息确认页面
import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import './loan-information-confirmation.css';

const LoanInformationConfirmation = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // 修改初始状态为未选中
  const [showYearOnYear, setShowYearOnYear] = useState(false);
  const [showChainRatio, setShowChainRatio] = useState(false);
  // 添加悬停提示状态
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 从localStorage获取申请信息
    const savedData = localStorage.getItem('loanApplication');
    console.log('从localStorage获取的数据:', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('解析后的数据:', parsedData);
        console.log('文件名:', parsedData.propProofDocsName);
        setApplicationData(parsedData);
      } catch (err) {
        console.error('解析申请数据失败:', err);
        // 如果解析失败，使用默认数据
        setDefaultData();
      }
    } else {
      // 如果localStorage中没有数据，使用默认数据
      setDefaultData();
    }
    setIsLoading(false);
  }, []);

  // 设置默认mock数据。测试用
  const setDefaultData = () => {
    const defaultData = {
      entName: "",
      uscc: "",
      companyEmail: "",
      companyAddress: "",
      repayAccountBank: "",
      repayAccountNo: "",
      loanAmount: "",
      loanTerm: "",
      loanPurpose: "",
      propProofType: "",
      propProofDocsName: "",// 添加文件名字段
      industryCategory: ""
    };
    setApplicationData(defaultData);
  };

   /**
   * 处理确认提交
   * 模拟API调用后跳转到结果页面
   */
  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // 由于没有后端API，直接跳转到结果页面
      setTimeout(() => {
        window.location.href = '/loan-result';
      }, 1000);
    } catch (err) {
      console.error('确认申请出错:', err);
      alert('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

const handleBack = () => {
  // 设置retainData标记，指示需要保留表单数据
  localStorage.setItem('retainData', 'true');
  window.location.href = '/corporation-loan-application';
};

const profitData = applicationData?.financialData || [
  { period: '2023.1Q', value: 20911231, yearOnYear: "", chainRatio: "0.1" },
  { period: '2023.2Q', value: 20922210, yearOnYear: "", chainRatio: "-0.4" },
  { period: '2023.3Q', value: 20845238, yearOnYear: "", chainRatio: "5.3" },
  { period: '2023.4Q', value: 21953132, yearOnYear: "", chainRatio: "-4.6" },
  { period: '2024.1Q', value: 20943983, yearOnYear: "0.2%", chainRatio: "9.7" },
  { period: '2024.2Q', value: 22983143, yearOnYear: "9.9", chainRatio: "0.5" },
  { period: '2024.3Q', value: 23087998, yearOnYear: "10.8", chainRatio: "7.3" },
  { period: '2024.4Q', value: 24762999, yearOnYear: "12.8", chainRatio: "" }
];

// 移除动态计算的最大值，使用固定最大值25000000
const FIXED_MAX_VALUE = 25000000;

  // 格式化数字显示，添加千分位分隔符
const formatNumber = (num) => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

  // 格式化百分比显示
const formatPercentage = (num) => {
  return num.toFixed(1);
};
  
  // 生成Y轴刻度的函数 - 返回固定的利润数字序列
 const generateYAxisTicks = () => {
  return [25000000, 20000000, 15000000, 10000000, 5000000, 0];
};

  // 计算百分比数据点的Y坐标位置
  const getPercentageYPosition = (value) => {
    // 假设百分比范围是 -10% 到 20%
    const minPercentage = -10;
    const maxPercentage = 20;
    const range = maxPercentage - minPercentage;
    return ((value - minPercentage) / range) * 100;
  };

  // 生成折线图路径
  const generateLinePath = (data, property) => {
    if (!data || data.length === 0) return '';
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - getPercentageYPosition(item[property]);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // 处理悬停事件
  const handleMouseEnter = (data, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const chartRect = document.querySelector('.chart-content').getBoundingClientRect();
    
    setTooltipData(data);
    setTooltipPosition({
      x: rect.left - chartRect.left + rect.width / 2,
      y: rect.top - chartRect.top - 10
    });
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  if (isLoading) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="loading">加载中...</div>
      </BaseLayout>
    );
  }

  if (error || !applicationData) {
    return (
      <BaseLayout title="Loan Information Confirmation">
        <div className="error-message">
          {error || '申请信息不存在'}
          <button onClick={() => window.location.href = '/'}>返回首页</button>
        </div>
      </BaseLayout>
    );
  }

  // 组件渲染
  return (
    <BaseLayout title="Loan Information Confirmation">
      <div className="loan-information-confirmation">
        {/* 删除企业确认画面标题 */}
        <h2 style={{ textAlign: 'center' }}>Loan Information Confirmation</h2>
        
        {/* 贷款类型标识 */}
        <div className="loan-type-indicator">
          <span className="loan-type">Corporation Loan</span>
          <div className="underline"></div>
        </div>
        
        <div className="confirmation-card">
          {/* 企业贷款信息 - 表单样式 */}
          <div className="form-style">
            <div className="form-row">
              <div className="form-field">
                <label>Company Name</label>
                <div className="form-value">{applicationData.entName || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Uscc</label>
                <div className="form-value">{applicationData.uscc || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Company Email</label>
                <div className="form-value">{applicationData.companyEmail || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Company Address</label>
                <div className="form-value">{applicationData.companyAddress || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Repay Account Bank</label>
                <div className="form-value">{applicationData.repayAccountBank || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Repay Account No</label>
                <div className="form-value">{applicationData.repayAccountNo || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Amount</label>
                <div className="form-value">{applicationData.loanAmount || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Term</label>
                <div className="form-value">{applicationData.loanTerm || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Loan Purpose</label>
                <div className="form-value">{applicationData.loanPurpose || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Property Proof Type</label>
                <div className="form-value">{applicationData.propProofType || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Property Proof Document</label>
                <div className="form-value">{applicationData.propProofDocsName || '-'}</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Industry Category</label>
                <div className="form-value">{applicationData.industryCategory || '-'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 财务数据图表部分 */}
        <div className="financial-chart-section">
          <div className="chart-header">
            <div className="chart-title-container">
              <h3>财务数据图表</h3>
              <div className="chart-legend">
                <span>
                  <span className="legend-dot profit"></span>
                  利润
                </span>
                <span className="legend-item year-on-year">
                  <span className="legend-line year-on-year-line"></span>
                  同比
                </span>
                <span className="legend-item chain-ratio">
                  <span className="legend-line chain-ratio-line"></span>
                  环比
                </span>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            {/* 图表内容 */}
            <div className="chart-content">
              {/* 左侧Y轴 - 现在显示百分比（交换后） */}
              <div className="left-y-axis">
                <div className="axis-title">利润</div>
                {[20, 15, 10, 5, 0, -5, -10].map((value, index) => (
                  <div 
                    key={index} 
                    className="y-axis-tick"
                    style={{ bottom: `${getPercentageYPosition(value)}%` }}
                  >
                    {value}%
                  </div>
                ))}
              </div>
              
              {/* 中央图表区域 */}
              <div className="chart-main">
                {/* 网格线 */}
                <div className="grid-lines">
                  {/* 水平网格线 - 使用固定利润序列 */}
                  {generateYAxisTicks().map((value, index) => (
                    <div 
                      key={`h-${index}`} 
                      className="horizontal-grid-line"
                      style={{ bottom: `${(value / FIXED_MAX_VALUE) * 100}%` }}
                    ></div>
                  ))}
                  {/* 垂直网格线 */}
                  {profitData.map((item, index) => {
                    const position = (index / (profitData.length - 1)) * 100;
                    return (
                      <div 
                        key={`v-${index}`} 
                        className="vertical-grid-line"
                        style={{ left: `${position}%` }}
                      ></div>
                    );
                  })}
                </div>
                
                {/* 柱状图 - 利润数据 - 使用固定最大值 */}
                <div className="bar-chart">
                  {profitData.map((item, index) => {
                    const barHeight = (item.value / FIXED_MAX_VALUE) * 100;
                    const barPosition = (index / (profitData.length - 1)) * 100;
                    return (
                      <div 
                        key={index} 
                        className="bar"
                        style={{ 
                          height: `${barHeight}%`,
                          left: `${barPosition}%`
                        }}
                        onMouseEnter={(e) => handleMouseEnter(item, e)}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={(e) => handleMouseEnter(item, e)}
                        onTouchEnd={handleMouseLeave}
                      >
                        <div className="bar-value">{formatNumber(item.value)}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 折线图容器 - 合并同比环比折线图 */}
                {(showYearOnYear || showChainRatio) && (
                  <div className="line-chart">
                    <svg className="chart-svg" width="100%" height="100%">
                      {/* 同比折线 - 蓝色实线 */}
                      {showYearOnYear && (
                        <>
                          <path 
                            d={generateLinePath(profitData, 'yearOnYear')}
                            className="line year-on-year-line"
                            fill="none"
                            stroke="#0000ff"
                            strokeWidth="2"
                          />
                          {/* 同比数据标签 */}
                          {profitData.map((item, index) => {
                            const x = (index / (profitData.length - 1)) * 100;
                            const y = 100 - getPercentageYPosition(item.yearOnYear);
                            return (
                              <text 
                                key={`yoy-label-${index}`} 
                                x={`${x}%`} 
                                y={`${y - 12}%`} 
                                textAnchor="middle"
                                className="data-label year-on-year-label"
                                fill="#0000ff"
                              >
                                {formatPercentage(item.yearOnYear)}%
                              </text>
                            );
                          })}
                        </>
                      )}
                      
                      {/* 环比折线 - 绿色虚线 */}
                      {showChainRatio && (
                        <>
                          <path 
                            d={generateLinePath(profitData, 'chainRatio')}
                            className="line chain-ratio-line"
                            fill="none"
                            stroke="#008000"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                          {/* 环比数据标签 */}
                          {profitData.map((item, index) => {
                            const x = (index / (profitData.length - 1)) * 100;
                            const y = 100 - getPercentageYPosition(item.chainRatio);
                            return (
                              <text 
                                key={`cr-label-${index}`} 
                                x={`${x}%`} 
                                y={`${y + 15}%`} 
                                textAnchor="middle"
                                className="data-label chain-ratio-label"
                                fill="#008000"
                              >
                                {formatPercentage(item.chainRatio)}%
                              </text>
                            );
                          })}
                        </>
                      )}
                    </svg>
                  </div>
                )}
                
                {/* X轴标签 */}
                <div className="x-axis">
                  {profitData.map((item, index) => {
                    const position = (index / (profitData.length - 1)) * 100;
                    return (
                      <div 
                        key={index} 
                        className="x-axis-label"
                        style={{ left: `${position}%` }}
                      >
                        {item.period}
                      </div>
                    );
                  })}
                </div>
                
                {/* 悬停提示框 */}
                {tooltipData && (
                  <div 
                    className="tooltip"
                    style={{
                      left: `${tooltipPosition.x}px`,
                      top: `${tooltipPosition.y}px`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    <div className="tooltip-period">{tooltipData.period}</div>
                    <div className="tooltip-item">
                      <span className="tooltip-label profit">利润</span>
                      <span className="tooltip-value">{formatNumber(tooltipData.value)}</span>
                    </div>
                    {showYearOnYear && (
                      <div className="tooltip-item">
                        <span className="tooltip-label year-on-year">同比</span>
                        <span className="tooltip-value">{formatPercentage(tooltipData.yearOnYear)}</span>
                      </div>
                    )}
                    {showChainRatio && (
                      <div className="tooltip-item">
                        <span className="tooltip-label chain-ratio">环比</span>
                        <span className="tooltip-value">{formatPercentage(tooltipData.chainRatio)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* 右侧Y轴 - 现在显示利润（交换后） */}
              <div className="right-y-axis">
                <div className="axis-title">百分比</div>
                {generateYAxisTicks().map((value, index) => (
                  <div 
                    key={index} 
                    className="y-axis-tick"
                    style={{ bottom: `${(value / FIXED_MAX_VALUE) * 100}%` }}
                  >
                    {formatNumber(value)}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 复选框切换 */}
            <div className="chart-toggle">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  className="custom-checkbox"
                  checked={showYearOnYear} 
                  onChange={() => setShowYearOnYear(!showYearOnYear)} 
                />
                <span>同比</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  className="custom-checkbox"
                  checked={showChainRatio} 
                  onChange={() => setShowChainRatio(!showChainRatio)} 
                />
                <span>环比</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* 按钮 */}
        <div className="form-actions">
          <button 
            className="back-button"
            onClick={handleBack}
          >
            back
          </button>
          <button 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            confirm
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoanInformationConfirmation;