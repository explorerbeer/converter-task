/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyTable.css';
import ExchangeBlock from '../ExchangeBlock/ExchangeBlock';
import DateBlock from './DateBlock';
import CurrencyList from '../CurrencyList/CurrencyList';

const CurrencyTable = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/currencies/${new Date(
            selectedDate
          ).toISOString()}`
        );
        const currData = response.data;
        const newData = currData.filter((el) => {
          if (el.shortname !== 'BYN') {
            return el;
          }
          return false;
        });
        setCurrencies(newData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/currencies/${selectedDate.toISOString()}`
        );
        const currData = response.data;
        const newData = currData.filter((el) => {
          if (el.shortname !== 'BYN') {
            return el;
          }
          return false;
        });
        setCurrencies(newData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="table-etc">
        <div className="CurrencyTable">
          {currencies ? (
            <CurrencyList currencies={currencies} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="date-and-exchange">
          <ExchangeBlock />
          <DateBlock
            value={selectedDate}
            handleDateChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyTable;
