// 下拉选择组件
import React from 'react';
import PropTypes from 'prop-types';
import './select-field.css';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error, 
  required = false,
  placeholder = 'Please select'
}) => {
  // 确保value永远不会是null，使用空字符串代替
  const selectValue = value === null ? '' : value;
  
  return (
    <div className="select-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={selectValue}  // 使用处理后的value
        onChange={onChange}
        className={error ? 'error' : ''}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string
};

export default SelectField;