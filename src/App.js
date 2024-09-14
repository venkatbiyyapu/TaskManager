import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup'; 
import Dashboard from './components/dashboard_compents/Dashboard';
import Add from './components/dashboard_compents/Add'; 
import Edit from './components/dashboard_compents/Edit';
import Delete from './components/dashboard_compents/Delete'; 

function App(){
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add" element={<Add />} />
          <Route path="/dashboard/edit/:id" element={<Edit />} />
          <Route path="/dashboard/delete/:id" element={<Delete />} />
        </Routes>
    </Router>
  );
};


export default App;
