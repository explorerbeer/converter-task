const pg = require('pg');

const Pool = pg.Pool;

const pool = new Pool({
  database: 'online_converter',
  host: 'localhost',
  user: 'testuser',
  password: '9706798zxc',
});

class ConverterDatabase {
  pool = new Pool({
    database: 'online_converter',
    host: 'localhost',
    user: 'testuser',
    password: '9706798zxc',
  });

  async getAllCurrenciesWithPrice(date) {
    const data = await pool.query(
      `SELECT DISTINCT c.id, c.short_name as shortname, c.full_name as fullname, e.currency_price as price, e.currency_scale as scale 
      FROM currencies c JOIN exchange_rates e ON c.id = e.currency_id 
      WHERE e.created_at = $1
       ORDER BY fullname ASC, shortname ASC`,
      [`${date.split('T')[0]} 00:00:00`]
    );
    return data.rows;
  }

  async getActualDataFromCurrencies() {
    const currId = await pool.query(
      'SELECT id, currency_id, full_name FROM currencies'
    );
    return currId.rows;
  }

  async uploadCurrencies(currencies) {
    const date = await pool.query('SELECT COUNT(*) FROM currencies');

    if (date.rows[0].count == 0) {
      currencies.map(async (el) => {
        const uplCurrs = await pool.query(
          `INSERT INTO currencies(currency_id, updated_at, short_name, full_name) 
          VALUES ($1, $2, $3, $4)`,
          [el.currency_id, el.updated_at, el.short_name, el.full_name]
        );
      });
      await pool.query(
        `INSERT INTO currencies(currency_id, updated_at, short_name, full_name) 
        VALUES ($1, $2, $3, $4)`,
        [1, new Date(), 'BYN', 'Белорусский рубль']
      );
    }
  }

  async uploadRates(rates) {
    const date = await pool.query(
      `SELECT id FROM exchange_rates WHERE created_at = $1`,
      [rates[0].created_at]
    );

    if (date.rowCount > 0) {
      rates.map(async (el) => {
        const updatedRates = await pool.query(
          `UPDATE exchange_rates 
          SET currency_price = $1, currency_scale = $2
           WHERE currency_id = $3 AND created_at = $4`,
          [
            el.currency_price,
            el.currency_scale,
            el.currency_id,
            el.created_at,
          ]
        );
      });
    } else {
      rates.map(async (el) => {
        const uplRates = await pool.query(
          `INSERT INTO exchange_rates(currency_id, editor_id, currency_price, currency_scale, edited_at, created_at) 
          VALUES($1, $2, $3, $4, $5, $6)`,
          [
            el.currency_id,
            el.editor_id,
            el.currency_price,
            el.currency_scale,
            null,
            el.created_at,
          ]
        );
      });
      const bel_id = await pool.query(
        `SELECT id FROM currencies WHERE currency_id = '1'`
      );
      await pool.query(
        `INSERT INTO exchange_rates(currency_id, editor_id, currency_price, currency_scale, edited_at, created_at) 
        VALUES($1, $2, $3, $4, $5, $6)`,
        [bel_id.rows[0].id, 1, 1, 1, null, new Date()]
      );
    }
  }

  async getExchangeRateById(id) {
    const exchange_rate = await pool.query(
      `SELECT currency_price, currency_scale 
      FROM exchange_rates 
      WHERE currency_id = $1`,
      [id]
    );
    return exchange_rate.rows[0];
  }

  async createLog(transaction) {
    try {
      const data = await pool.query(
        `INSERT INTO logs(user_id, currency_from_id, currency_to_id, exchange_rate, input_count, output_count, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          transaction.user_id,
          transaction.currency_from_id,
          transaction.currency_to_id,
          transaction.exchange_rate,
          transaction.input_count,
          transaction.output_count,
          transaction.created_at,
        ]
      );
      return 1;
    } catch (error) {
      return error;
    }
  }

  async getLogs() {
    const logs = await pool.query(
      `SELECT u.login AS userlogin,
      c1.short_name AS currency_from_short,
      c2.short_name AS currency_to_short,
      l.exchange_rate,
      l.input_count,
      l.output_count,
      l.created_at
      FROM logs l
      JOIN currencies c1 ON l.currency_from_id = c1.id
      JOIN currencies c2 ON l.currency_to_id = c2.id
      JOIN users u ON l.user_id = u.id
      UNION
      SELECT u.login as userlogin, 
       c1.short_name AS currency_from_short, 
       c2.short_name AS currency_to_short, 
       al.exchange_rate, 
       al.input_count, 
       al.output_count, 
       al.created_at 
      FROM archive_logs al 
      JOIN currencies c1 ON al.currency_from_id = c1.id 
      JOIN currencies c2 ON al.currency_to_id = c2.id 
      JOIN users u ON al.user_id = u.id
      ORDER BY created_at DESC`
    );
    return logs.rows;
  }

  async getLogsByUserId(userId) {
    const logsById = await pool.query(
      `SELECT u.login AS userlogin,
      c1.short_name AS currency_from_short,
      c2.short_name AS currency_to_short,
      l.exchange_rate,
      l.input_count,
      l.output_count,
      l.created_at
      FROM logs l
      JOIN currencies c1 ON l.currency_from_id = c1.id
      JOIN currencies c2 ON l.currency_to_id = c2.id
      JOIN users u ON l.user_id = u.id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC`,
      [userId]
    );
    return logsById.rows;
  }

  async createUser(user) {
    try {
      const userEntity = await pool.query(
        `INSERT INTO users(login, password, is_admin) 
        VALUES($1, $2, false)`,
        [user.login, user.password]
      );
      return { ...user, is_admin: false };
    } catch (error) {
      return error;
    }
  }

  async getUser(login, password) {
    const userEntity = await pool.query(
      `SELECT * FROM users 
      WHERE login = $1 AND password = $2`,
      [login, password]
    );
    return userEntity.rows[0];
  }

  async getUserById(id) {
    const userEntity = await pool.query(
      `SELECT login 
      FROM users 
      WHERE id = $1`,
      [id]
    );
    return userEntity.rows[0];
  }

  async getRateByDate(date) {
    const rates = await pool.query(
      `SELECT currencies.short_name, currencies.full_name, exchange_rates.currency_price, exchange_rates.currency_scale, exchange_rates.edited_at, exchange_rates.created_at 
      FROM exchange_rates 
      JOIN currencies ON currencies.id = exchange_rates.currency_id 
      WHERE exchange_rates.created_at = $1`,
      [date]
    );
    return rates.rows;
  }

  async updateRatesByAdmin(rates) {
    try {
      const result = await pool.query(
        `UPDATE exchange_rates 
         SET currency_price = $1,
             currency_scale = $2,
             edited_at = $3
         WHERE currency_id = $4 AND created_at = $5`,
        [
          rates.currency_price,
          rates.currency_scale,
          rates.edited_at,
          rates.currency_id,
          new Date().toISOString().split('T')[0],
        ]
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async moveLogsToArchive(userId) {
    await pool.query(
      `INSERT INTO archive_logs (user_id, currency_from_id, currency_to_id, exchange_rate, input_count, output_count, created_at)
      SELECT user_id, currency_from_id, currency_to_id, exchange_rate, input_count, output_count, created_at
      FROM logs
      WHERE user_id = $1`,
      [userId]
    );
  }

  async deleteLogs(userId) {
    await pool.query(`DELETE FROM logs WHERE user_id = $1`, [userId]);
  }
}

module.exports = ConverterDatabase;
