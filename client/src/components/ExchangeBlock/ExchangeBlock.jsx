/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Input from '../utils/Input';
import CurrencySelect from '../CurrencySelect/CurrencySelect';
import './ExchangeBlock.css';
import axios from 'axios';

const ExchangeBlock = () => {
  const isAuth = localStorage.getItem('userId') ? true : false;

  const [currencyFromId, setCurrencyFromId] = useState('AUD');
  const [currencyToId, setCurrencyToId] = useState('AUD');

  const [inputCount, setInputCount] = useState('');
  const [outputCount, setOutputCount] = useState('');

  const [currencies, setCurrencies] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `http://localhost:4000/currencies/${new Date().toISOString()}`
      );
      setCurrencies(response.data);
    } catch (e) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCurrencyFromChange = (event) => {
    setCurrencyFromId(event.target.value);
  };

  const handleCurrencyToChange = (event) => {
    setCurrencyToId(event.target.value);
  };

  useEffect(() => {
    handleInputFromChange({ target: { value: inputCount } });
  }, [currencyFromId, currencyToId]);

  useEffect(() => {
    handleInputToChange({ target: { value: outputCount } });
  }, [currencyFromId, currencyToId]);

  const handleInputFromChange = (event) => {
    setInputCount(event.target.value);
    const currencyTo = currencies.find(
      (el) => el.shortname === currencyToId
    );
    const currencyFrom = currencies.find(
      (el) => el.shortname === currencyFromId
    );
    if (currencyFrom && currencyTo) {
      const input =
        ((currencyFrom.price * event.target.value) /
          currencyFrom.scale /
          currencyTo.price) *
        currencyTo.scale;
      setOutputCount(input.toFixed(4));
    }
  };

  const handleInputToChange = (event) => {
    setOutputCount(event.target.value);
    const currencyFrom = currencies.find(
      (el) => el.shortname === currencyFromId
    );
    const currencyTo = currencies.find(
      (el) => el.shortname === currencyToId
    );
    if (currencyFrom && currencyTo) {
      const out =
        ((currencyTo.price * event.target.value) /
          currencyTo.scale /
          currencyFrom.price) *
        currencyFrom.scale;
      setInputCount(out.toFixed(4));
    }
  };

  const handleCreateLog = async () => {
    const userId = parseInt(localStorage.getItem('userId'));
    const currencyFrom = currencies.find(
      (el) => el.shortname === currencyFromId
    );
    const currencyTo = currencies.find(
      (el) => el.shortname === currencyToId
    );
    const exchangeRate = inputCount / outputCount;

    if (!inputCount) {
      alert('Пожалуйста, введите сумму для обмена.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/logs/new',
        {
          currency_from_id: currencyFrom.id,
          currency_to_id: currencyTo.id,
          exchange_rate: exchangeRate,
          input_count: inputCount,
          output_count: outputCount,
        },
        {
          headers: {
            userId: userId,
          },
        }
      );
      alert('Обмен проведён успешно!');
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="exchange_block">
      <h3>Обмен валют</h3>
      <div className="currency_block">
        <Input
          value={inputCount}
          className="currency_input"
          onChange={handleInputFromChange}
          type="number"
          placeholder="Обмениваемая валюта"
        ></Input>
        <CurrencySelect
          className={'currency_from'}
          onCurrencyChange={handleCurrencyFromChange}
        ></CurrencySelect>
      </div>
      <div className="currency_block">
        <Input
          value={outputCount}
          className="currency_input"
          type="number"
          onChange={handleInputToChange}
        ></Input>
        <CurrencySelect
          className={'currency_to'}
          onCurrencyChange={handleCurrencyToChange}
        ></CurrencySelect>
      </div>
      <div className="currency_block">
        {isAuth && (
          <button className="buttonBlock" onClick={handleCreateLog}>
            Обменять
          </button>
        )}
      </div>
    </div>
  );
};

export default ExchangeBlock;
