import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../SessionLog/SessionLog.css';

const AdminSessionLog = () => {
  const [logs, setLogs] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get(
          'http://localhost:4000/logs',
          {
            headers: { userId: userId },
          }
        );
        setLogs(response.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchLogs();
  }, [userId]);

  return (
    <div className="transactions">
      <h1>Проведённые операции</h1>
      {logs ? (
        <ul>
          {logs.map((log) => (
            <li
              key={`${log.id}-${log.created_at}`}
              className="log-item"
            >
              <div className="currency">
                <label className="label">Имя пользователя:</label>
                {log.userlogin}
              </div>
              <div className="currency">
                <label className="label">Первая валюта:</label>
                {log.currency_from_short}
              </div>
              <div className="currency">
                <label className="label">Вторая валюта:</label>
                {log.currency_to_short}
              </div>
              <div>
                <label className="label">Курс обмена:</label>
                {log.exchange_rate}
              </div>
              <div>
                <label className="label">Входящая сумма:</label>
                {log.input_count}
              </div>
              <div>
                <label className="label">Исходящая сумма:</label>
                {log.output_count}
              </div>
              <div>
                <label className="label">Дата и время:</label>
                {new Date(log.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>Загрузка...</div>
      )}
    </div>
  );
};

export default AdminSessionLog;
