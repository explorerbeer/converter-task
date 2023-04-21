import React from 'react';
import './DateBlock.css';

const DateBlock = ({ selectedDate, handleDateChange }) => {
  return (
    <div className="DateBlock">
      <h3 className="HeaderStyle">Выбрать дату</h3>
      <input
        className="InputStyle"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DateBlock;
