// 表单输入组件
import React from 'react';
import PropTypes from 'prop-types';
import './input-field.css';

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  type = 'text' 
}) => {
  return (
    <div className="input-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
};

export default InputField;