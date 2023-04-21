import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../Navigation/Layout.css';
import '../Navigation/Header.css';

const AdminLayout = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAuth = localStorage.getItem('userId') ? true : false;

  return (
    <>
      {isAdmin && (
        <header className="header">
          <Link to="/admin" className="link">
            Редактирование валют
          </Link>
          <Link to="admin-logs" className="link">
            Действия пользователей
          </Link>
          {!isAuth && (
            <div className="auth">
              <Link to="/login" className="link">
                Авторизация
              </Link>
            </div>
          )}
          {isAuth && localStorage.getItem('userId') && (
            <Link
              to="/login"
              className="link"
              onClick={() => localStorage.removeItem('userId')}
            >
              Выйти
            </Link>
          )}
        </header>
      )}
      <div className="Layout">
        <Outlet />
      </div>
    </>
  );
};

export { AdminLayout };
