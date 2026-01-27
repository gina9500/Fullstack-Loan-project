/**
 * 清除所有相关的 localStorage 数据
 */
export const clearAllStorageData = () => {
  console.log('开始清除所有 storage 数据...');

  const storageKeys = [
    'token',
    'userInfo',
    'loanApplication',
    'retainData',
    'loginError',
    'lastVisitedPath',
    'currentPage'
  ];

  storageKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`删除 storage 数据: ${key} = ${localStorage.getItem(key)}`);
      localStorage.removeItem(key);
    }
  });

  console.log('所有相关 storage 数据已清除');
};