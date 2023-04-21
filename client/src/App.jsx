import React from 'react';
import CurrencyTable from './components/CurrencyTable/CurrencyTable';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SessionLog from './components/SessionLog/SessionLog';
import { Layout } from './components/Navigation/Layout';
import Registration from './components/Auth/Registration';
import Login from './components/Auth/Login';
import { AdminLayout } from './components/Admin/AdminLayout';
import AdminSessionLog from './components/Admin/AdminSessionLog';
import AdminTable from './components/Admin/AdminTable';

function App() {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userId = localStorage.getItem('userId');
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CurrencyTable />}></Route>
          <Route path="logs" element={<SessionLog />}></Route>
        </Route>
        {isAdmin && userId && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminTable />}></Route>
            <Route
              path="admin-logs"
              element={<AdminSessionLog />}
            ></Route>
          </Route>
        )}
        <Route
          path="/registration"
          element={<Registration />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
