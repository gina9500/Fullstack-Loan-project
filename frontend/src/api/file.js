// 文件上传相关API
import { upload } from '../utils/request';

/**
 * 上传文件
 * @param {File} file - 文件对象
 * @returns {Promise} - 返回Promise对象
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return upload('/file/upload', formData);
}