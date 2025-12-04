import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

// 默认财务数据（当没有外部数据传入时使用）
const defaultProfitData = [
  { period: '2023.1Q', value: 20000000, yearOnYear: "", chainRatio: "0.1%" },
  { period: '2023.2Q', value: 21000000, yearOnYear: "", chainRatio: "-0.4%" },
  { period: '2023.3Q', value: 22000000, yearOnYear: "", chainRatio: "5.3%" },
  { period: '2023.4Q', value: 23000000, yearOnYear: "", chainRatio: "-4.6%" },
  { period: '2024.1Q', value: 20943983, yearOnYear: "0.2%", chainRatio: "9.7%" },
  { period: '2024.2Q', value: 22983143, yearOnYear: "9.9%", chainRatio: "0.5%" },
  { period: '2024.3Q', value: 23087998, yearOnYear: "10.8%", chainRatio: "7.3%" },
  { period: '2024.4Q', value: 24762999, yearOnYear: "12.8%", chainRatio: "" }
];

const FinancialChart = ({ financialData }) => {
  const [showYearOnYear, setShowYearOnYear] = useState(false);
  const [showChainRatio, setShowChainRatio] = useState(false);

  const handleYearOnYearChange = () => setShowYearOnYear(!showYearOnYear);
  const handleChainRatioChange = () => setShowChainRatio(!showChainRatio);

  // 后端传入的数据不为空就用传过来的数据，否则用默认数据
  const profitData = financialData && financialData.length > 0 ? financialData : defaultProfitData;

  // 转换数据：将百分比字符串转换为数字（小数形式）
  const chartData = profitData.map(item => ({
    ...item,
    yearOnYear: item.yearOnYear ? parseFloat(item.yearOnYear.replace('%', '')) / 100 : null,
    chainRatio: item.chainRatio ? parseFloat(item.chainRatio.replace('%', '')) / 100 : null
  }));

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
      <BarChart
        width={650}
        height={450}
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis
          yAxisId="left"
          orientation="left"
          domain={[0, 25000000]}
          label={{ value: '利润', angle: -90, position: 'insideLeft', fontSize: 12 }}
          ticks={[0, 5000000, 10000000, 15000000, 20000000, 25000000]}
          tickFormatter={(value) => new Intl.NumberFormat('zh-CN').format(value)}
          tick={{ fill: '#1890ff' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[-0.1, 0.2]}
          label={{ value: '百分比', angle: -90, position: 'insideLeft', fontSize: 12 }}
          ticks={[-0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2]}
          tickFormatter={(value) => `${value * 100}%`}
          tick={{ fill: '#ff7875' }} 
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === '利润') {
              return [new Intl.NumberFormat('zh-CN').format(value), name];
            } else {
              return [`${(value * 100).toFixed(1)}%`, name];
            }
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ 
            position: 'relative',
            top: '-20px',
            textAlign: 'center',
            width: '100%',
            fontSize: '14px'
          }}
        />
        
 
        <Bar yAxisId="left" dataKey="value" fill="#ff0000" name="利润" />
        <Line 
          yAxisId="right" 
          dataKey={() => 0} 
          stroke="transparent" 
          strokeWidth={0} 
          dot={false} 
          activeDot={false} 
          name="" 
        />
        {showYearOnYear && <Line yAxisId="right" dataKey="yearOnYear" stroke="#8884d8" name="同比" strokeWidth={4}/>}
        {showChainRatio && <Line yAxisId="right" dataKey="chainRatio" stroke="#82ca9d" name="环比" strokeWidth={4}/>}
        
      </BarChart>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '15px',
        gap: '20px'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="checkbox" 
            checked={showYearOnYear} 
            onChange={handleYearOnYearChange} 
          />
          同比
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="checkbox" 
            checked={showChainRatio} 
            onChange={handleChainRatioChange} 
          />
          环比
        </label>
      </div>
    </div>
  );
};

export default FinancialChart;