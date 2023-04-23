const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cron = require('node-cron');
const route = require('./routes');
const getAllActualDataFromAPI = require('./services/nbrb.service');
const cors = require('cors');
dotenv.config();

const ConverterDatabase = require('./infrastructure/requests');
const orm = new ConverterDatabase();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.SERVER_PORT || 4000;

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }

  console.log('Node.js listening... ' + port);
});

app.use(route);

async function uploadCurrencyData(user) {
  if (user == 'admin') {
    const currDataFromNB = await getAllActualDataFromAPI();
    const currencies = currDataFromNB.map((el) => {
      return {
        currency_id: el.Cur_ID,
        updated_at: el.Date,
        short_name: el.Cur_Abbreviation,
        full_name: el.Cur_Name,
      };
    });
    await orm.uploadCurrencies(currencies);
  }
}

async function uploadRateData(user) {
  if (user == 'admin') {
    const [rateDataFromNB, currDataFromDB] = await Promise.all([
      getAllActualDataFromAPI(),
      orm.getActualDataFromCurrencies(),
    ]);
    const rates = rateDataFromNB.map((el) => {
      const currencyId = currDataFromDB.find(
        (curr) => curr.currency_id === el.Cur_ID
      );
      if (!currencyId) {
        throw new Error(`Currency with code ${el.Cur_ID} not found`);
      }
      return {
        currency_id: currencyId.id,
        editor_id: 1,
        currency_price: el.Cur_OfficialRate,
        currency_scale: el.Cur_Scale,
        created_at: el.Date,
      };
    });
    await orm.uploadRates(rates);
  }
}

cron.schedule('5 3 * * *', () => {
  console.log('updated');
  uploadRateData('admin');
});

uploadCurrencyData('admin');
setTimeout(() => uploadRateData('admin'), 5000);
