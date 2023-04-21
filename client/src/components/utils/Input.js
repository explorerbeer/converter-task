import React from 'react';
import './Input.css';

const Input = ({ value, onChange, type, disabled, placeholder }) => {
  return (
    <div>
      <input
        className="input_component"
        value={value}
        onChange={onChange}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
