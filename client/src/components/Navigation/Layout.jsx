import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';
import './Header.css';

const Layout = () => {
  const isAuth = localStorage.getItem('userId') ? true : false;

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('http://localhost:4000/move', { userId });
      localStorage.removeItem('userId');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="link">
          Курсы валют
        </Link>
        <Link to="logs" className="link">
          Последние действия
        </Link>
        {!isAuth && (
          <div className="auth">
            <Link to="/login" className="link">
              Авторизация
            </Link>
            <Link to="/registration" className="authLink">
              Регистрация
            </Link>
          </div>
        )}
        {isAuth && localStorage.getItem('userId') && (
          <Link to="/login" className="link" onClick={handleLogout}>
            Выйти
          </Link>
        )}
      </header>
      <div className="Layout">
        <Outlet />
      </div>
    </>
  );
};

export { Layout };
