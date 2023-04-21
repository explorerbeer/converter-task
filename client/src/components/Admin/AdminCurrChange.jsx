import React, { useState } from 'react';
import AdminCurrencySelect from './AdminCurrencySelect';
import axios from 'axios';
import Input from '../utils/Input';
import './AdminCurrChange.css';

const AdminCurrChange = ({ currencies, updateTable }) => {
  const [price, setPrice] = useState(0);
  const [scale, setScale] = useState(0);
  const [selectedCurr, setSelectedCurr] = useState('AUD');

  const handleChangeRateAndScale = async () => {
    try {
      const currency = currencies.filter((el) => {
        if (el.shortname === selectedCurr) {
          return el;
        }
        return false;
      });
      await axios.put(
        `http://localhost:4000/exchange-rates/${currency[0].id}`,
        {
          currency_price: price,
          currency_scale: scale,
          edited_at: new Date().toISOString(),
        }
      );
      updateTable();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurr(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  return (
    <div className="CurrChange">
      <div className="">
        <h3 className="EditHeader">Редактирование</h3>
        <div className="">
          <Input
            value={price}
            className="currency_input"
            onChange={handlePriceChange}
            type="number"
            placeholder="Цена"
          ></Input>
        </div>
        <div className="">
          <Input
            value={scale}
            className="currency_input"
            onChange={handleScaleChange}
            type="number"
            placeholder="Кол-во единиц"
          ></Input>
        </div>
      </div>
      <div className="SaveBlock">
        <button
          onClick={handleChangeRateAndScale}
          className="UpdateCurrButton"
        >
          Сохранить
        </button>
        <AdminCurrencySelect
          className={'admin_currency'}
          onCurrencyChange={handleCurrencyChange}
        />
      </div>
    </div>
  );
};

export default AdminCurrChange;
