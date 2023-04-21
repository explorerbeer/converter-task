import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [loginDirty, setLoginDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);

  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(
    'Поле не может быть пустым!'
  );
  const [passwordError, setPasswordError] = useState(
    'Поле не может быть пустым!'
  );

  const [formValid, setFormValid] = useState(false);

  const userLogin = async (login, password) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/login',
        {
          login,
          password,
        }
      );
      const isAdmin = response.data.is_admin;
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('isAdmin', isAdmin);
      if (isAdmin) {
        navigate('/admin');
        alert('Вы вошли как администратор!');
      } else {
        navigate('/');
        alert('Вы успешно авторизовались!');
      }
    } catch (e) {
      alert('Неверное имя пользователя или пароль!');
    }
  };

  useEffect(() => {
    if (loginError || passwordError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [loginError, passwordError]);

  const loginHandler = (e) => {
    if (!e.target.value) {
      setLoginError('Поле не может быть пустым!');
    } else {
      setLoginError('');
    }
    setLogin(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError('Поле не может быть пустым!');
    } else {
      setPasswordError('');
    }
  };

  const blurHandler = (e) => {
    switch (e.target.name) {
      case 'login':
        setLoginDirty(true);
        break;
      case 'password':
        setPasswordDirty(true);
        break;
      default:
    }
  };

  const handleRegistration = () => {
    navigate('/registration');
  };

  return (
    <div className="Registration">
      <form className="regForm">
        <h1 className="hForm">Авторизация</h1>
        {loginDirty && <div className="divForm">{loginError}</div>}
        <div className="divForm">{loginError}</div>
        <input
          className="inputForm"
          onChange={(e) => loginHandler(e)}
          onBlur={(e) => blurHandler(e)}
          value={login}
          name="Имя пользователя"
          type="text"
          placeholder="Введите имя пользователя..."
          maxLength={16}
        ></input>
        {passwordDirty && (
          <div className="divForm">{passwordError}</div>
        )}
        <div className="divForm">{passwordError}</div>
        <input
          className="inputForm"
          onChange={(e) => passwordHandler(e)}
          onBlur={(e) => blurHandler(e)}
          value={password}
          name="Пароль"
          type="password"
          placeholder="Введите пароль..."
        ></input>
        <button
          className="buttonForm"
          disabled={!formValid}
          type="button"
          onClick={async () => await userLogin(login, password)}
        >
          Войти
        </button>
        <div className="blockButton">
          <p>Нет аккаунта?</p>

          <button className="authButton" onClick={handleRegistration}>
            Зарегистрируйтесь!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
