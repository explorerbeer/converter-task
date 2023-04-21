import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CurrencySelect/CurrencySelect.css';

const AdminCurrencySelect = ({ className, onCurrencyChange }) => {
  const [currenciesList, setCurrenciesList] = useState([]);

  useEffect(() => {
    async function currList() {
      try {
        const response = await axios.get(
          `http://localhost:4000/currencies/${new Date().toISOString()}`
        );
        const newData = response.data;
        setCurrenciesList(newData);
      } catch (e) {
        console.error(e.message);
      }
    }
    currList();
  }, []);

  return (
    <div>
      <select className={className} onChange={onCurrencyChange}>
        {currenciesList.map((curr) => (
          <option key={curr.id} value={curr.shortname}>
            {curr.shortname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AdminCurrencySelect;
