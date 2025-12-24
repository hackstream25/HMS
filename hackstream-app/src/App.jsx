import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import Register from './Register';
import LoginSelector from './LoginSelector';
import AdminLogin from "./AdminLogin";

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/selectlogin" element={<LoginSelector />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;