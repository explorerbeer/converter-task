const express = require('express');
const ConverterDatabase = require('./infrastructure/requests');

const orm = new ConverterDatabase();
const app = express();

//регистрация пользователя
app.post('/registration', async (req, res, next) => {
  try {
    const userDto = req.body;
    const user = await orm.createUser(userDto);
    if (user.login.length > 0) {
      res.send(user);
    } else {
      throw new Error(user);
    }
  } catch (err) {
    res.statusCode = 401;
    res.send({
      message: 'Пользователь с таким логином уже существует',
      err,
    });
  }
});

//авторизация пользователя
app.post('/login', async (req, res, next) => {
  try {
    const getUserDto = req.body;
    const getUser = await orm.getUser(
      getUserDto.login,
      getUserDto.password
    );
    if (getUser) {
      res.send(getUser);
    } else {
      res.statusCode = 401;
      res.send({
        message:
          'Пользователь с такими данными не найден / Неверный логин пароль',
      });
    }
  } catch (err) {
    res.statusCode = 500;
    res.send({ message: 'Не удалось обработать запрос...' });
  }
});

//получение курсов валют по дате
app.get('/exchange_rates/:date', async (req, res, next) => {
  try {
    const date = req.params.date;
    const exchangeRates = await orm.getRateByDate(date);
    res.send(exchangeRates);
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: 'Не удалось обработать запрос...' });
  }
});

//подсчет результата обмена валют
app.post('/exchange_result', async (req, res, next) => {
  try {
    const exchangeRateFrom = await orm.getExchangeRateById(
      req.body.currency_from_id
    );
    const exchangeRateTo = await orm.getExchangeRateById(
      req.body.currency_to_id
    );

    let outputCount, exchangeRate;
    outputCount =
      ((exchangeRateFrom.currency_price * req.body.input_count) /
        exchangeRateFrom.currency_scale /
        exchangeRateTo.currency_price) *
      exchangeRateTo.currency_scale;
    exchangeRate = outputCount / req.body.input_count;
    res.send({ exchangeRate, outputCount });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: 'Не удалось обработать запрос...' });
  }
});

//просмотр логов
app.get('/logs', async (req, res, next) => {
  const userId = req.get('userId');
  if (!userId) {
    res.statusCode = 401;
    res.send({
      message: 'Вы не авторизованы',
    });
    return 0;
  }
  const userLogin = await orm.getUserById(userId);
  if (!userLogin) {
    res.statusCode = 401;
    res.send({
      message: 'Пользователя с таким ID не существует',
    });
    return 0;
  }
  if (userId == 1) {
    const logs = await orm.getLogs();
    res.send(logs);
  } else {
    const logs = await orm.getLogsByUserId(userId);
    res.send(logs);
  }
});

//создание лога
app.post('/logs/new', async (req, res, next) => {
  const userId = req.get('userId');
  if (!userId) {
    res.statusCode = 401;
    res.send({
      message: 'Вы не авторизованы',
    });
    return 0;
  }
  const userLogin = await orm.getUserById(userId);
  if (!userLogin) {
    res.statusCode = 401;
    res.send({
      message: 'Пользователя с таким ID не существует',
    });
    return 0;
  }

  const transactionDto = {
    ...req.body,
    user_id: userId,
    created_at: new Date(),
  };
  const transaction = await orm.createLog(transactionDto);
  if (transaction === 1) {
    res.json(transaction);
  } else {
    res.status(400);
    res.send('error');
  }
});

//вывод таблицы с данными о курсах валют
app.get('/currencies/:date', async (req, res, next) => {
  const date = req.params.date;
  try {
    const currencies = await orm.getAllCurrenciesWithPrice(date);
    res.send(currencies);
  } catch (e) {
    res
      .status(500)
      .send({ message: 'Не удалось обработать запрос...' });
  }
});

//перенос логов из одной таблицы в другую
app.post('/move', async (req, res, next) => {
  const { userId } = req.body;
  try {
    await orm.moveLogsToArchive(userId);
    await orm.deleteLogs(userId);
    res.send({ message: 'Данные успешно скопированы и удалены!' });
  } catch (e) {
    res
      .status(500)
      .send({ message: 'Не удалось обработать запрос...' });
  }
});

//редактирование админом таблицы.
app.put('/exchange-rates/:currency_id', async (req, res, next) => {
  const currencyId = req.params.currency_id;
  const { currency_price, currency_scale, edited_at } = req.body;
  try {
    const result = await orm.updateRatesByAdmin({
      currency_id: currencyId,
      currency_price: currency_price,
      currency_scale: currency_scale,
      edited_at: edited_at,
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ message: 'Не удалось обработать запрос...' });
  }
});

module.exports = app;
