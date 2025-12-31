import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import LoginSelector from './components/LoginSelector';
import AdminLogin from "./components/AdminLogin";
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/selectlogin" element={<LoginSelector />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;