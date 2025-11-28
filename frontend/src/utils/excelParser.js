// Excel数据解析工具
import * as XLSX from 'xlsx';

/**
 * 解析Excel文件为JSON数据
 * @param {File} file - Excel文件对象
 * @returns {Promise} - 返回解析后的JSON数据
 */
export const parseExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      reject(new Error('请上传Excel文件(.xlsx或.xls格式)'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表名称
        const firstSheetName = workbook.SheetNames[0];
        
        // 将工作表转换为JSON
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 格式化财务数据为图表可用格式
        const formattedData = formatFinancialData(jsonData);
        
        resolve({
          rawData: jsonData,
          formattedData: formattedData,
          maxValue: calculateMaxValue(formattedData)
        });
      } catch (error) {
        reject(new Error('Excel文件解析失败: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * 格式化财务数据为图表可用格式
 * @param {Array} jsonData - 原始JSON数据
 * @returns {Array} - 格式化后的数据
 */
const formatFinancialData = (jsonData) => {
  // 根据用户提供的Excel格式，识别财务期、利润、同比和环比列
  const formattedData = jsonData.map(item => {
    // 使用更安全的方式访问属性，避免语法错误
    const period = item['财务期'] || item.period || item['期间'] || item.Period || item.time || item['时间'];
    const value = item['利润'] || item.value || item['数值'] || item.Value || item.amount || item['金额'];
    const yearOnYear = item['同比'] || item.yearOnYear || 0;
    const chainRatio = item['环比'] || item.chainRatio || 0;
    
    // 确保值是数字类型
    const numericValue = typeof value === 'number' ? value : parseFloat(value || '') || 0;
    
    // 处理百分比格式的数据
    const parsePercentage = (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        // 移除百分号并转换为数字
        if (val.includes('%')) {
          return parseFloat(val.replace('%', '')) || 0;
        }
        return parseFloat(val) || 0;
      }
      return 0;
    };
    
    const numericYearOnYear = parsePercentage(yearOnYear);
    const numericChainRatio = parsePercentage(chainRatio);
    
    return {
      period: period || '未知期间',
      value: numericValue,
      yearOnYear: numericYearOnYear,
      chainRatio: numericChainRatio
    };
  }).filter(item => item.period !== '未知期间' && item.value > 0);
  
  // 如果没有有效的数据，返回默认数据
  if (formattedData.length === 0) {
    return getDefaultFinancialData();
  }
  
  return formattedData;
};

/**
 * 计算数据中的最大值
 * @param {Array} data - 格式化后的财务数据
 * @returns {number} - 最大值
 */
const calculateMaxValue = (data) => {
  if (data.length === 0) return 11000000; // 默认最大值
  
  const max = Math.max(...data.map(item => item.value));
  // 向上取整到合适的值，以便图表显示更美观
  return Math.ceil(max * 1.1);
};

/**
 * 获取默认的财务数据
 * @returns {Array} - 默认数据
 */
const getDefaultFinancialData = () => {
  return [
    { period: '2023.1Q', value: 10000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2023.2Q', value: 10000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2023.3Q', value: 10000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2023.4Q', value: 10000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2024.1Q', value: 11000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2024.2Q', value: 11000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2024.3Q', value: 11000000, yearOnYear: 0, chainRatio: 0 },
    { period: '2024.4Q', value: 11000000, yearOnYear: 0, chainRatio: 0 }
  ];
};

/**
 * 验证上传的文件是否为Excel文件
 * @param {File} file - 上传的文件
 * @returns {boolean} - 是否为Excel文件
 */
export const isValidExcelFile = (file) => {
  if (!file) return false;
  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
};