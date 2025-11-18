// 文件上传组件
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './file-upload-field.css';

const FileUploadField = ({ 
  label, 
  name, 
  onChange, 
  error, 
  required = false 
}) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(e);
    }
  };

  const handleButtonClick = () => {
    document.getElementById(`${name}-input`).click();
  };

  return (
    <div className="file-upload-field">
      <label htmlFor={`${name}-input`}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        id={`${name}-input`}
        name={name}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="file-upload-wrapper">
        <input
          type="text"
          value={fileName}
          readOnly
          className={`file-name ${error ? 'error' : ''}`}
        />
        <button 
          type="button" 
          className="upload-button"
          onClick={handleButtonClick}
        >
Browse Files
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

FileUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool
};

export default FileUploadField;