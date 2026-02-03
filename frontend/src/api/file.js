// 文件上传相关API
import { upload, post } from '../utils/request';

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

/**
 * 身份证OCR识别
 * @param {File} frontFile - 身份证正面图片
 * @param {File} backFile - 身份证反面图片
 * @returns {Promise} - 返回Promise对象
 */
export async function idCardOCR(frontFile, backFile) {
  const formData = new FormData();
  formData.append('frontFile', frontFile);
  formData.append('backFile', backFile);
  return post('/loan/personal/ocr', formData);
}