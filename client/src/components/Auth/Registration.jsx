import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registration.css';

const Registration = () => {
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

  const userRegistration = async (login, password) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/registration',
        {
          login,
          password,
          isAdmin: false,
        }
      );
      localStorage.setItem('userId', response.data.id);
      navigate('/login');
      alert('Регистрация прошла успешно!');
    } catch (e) {
      if (e.message) {
        alert(e.response.data.message);
      } else {
        alert('Произошла неизвестная ошибка!');
      }
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
    setLogin(e.target.value);
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(String(e.target.value))) {
      setLoginError(
        'Некорректный логин! Разрешены символы формата a-zA-z0-9'
      );
    } else {
      setLoginError('');
    }
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 3 || e.target.value.length > 16) {
      setPasswordError(
        'Пароль должен быть не менее 3 и не более 16 символов'
      );
      if (!e.target.value) {
        setPasswordError('Поле не может быть пустым!');
      }
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

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="Registration">
      <form className="regForm">
        <h1 className="hForm">Регистрация</h1>
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
          autoComplete="off"
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
          autoComplete="off"
        ></input>
        <button
          className="buttonForm"
          disabled={!formValid}
          type="button"
          onClick={async () =>
            await userRegistration(login, password)
          }
        >
          Регистрация
        </button>
        <div className="blockButton">
          <p>Есть аккаунт?</p>
          <button className="authButton" onClick={handleLogin}>
            Авторизуйтесь!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
