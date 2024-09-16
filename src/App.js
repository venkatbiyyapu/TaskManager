import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/dashboard_compents/Dashboard';
import Add from './components/dashboard_compents/Add';
import Edit from './components/dashboard_compents/Edit';
import ProtectedRoute from './components/utils/ProtectedRoute';
import { useFilter } from './components/utils/FilterContext';
import './style.css';

function App() {
  const { isAuth} = useFilter();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Navigate to="/dashboard" replace /> : <Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Edit />
            </ProtectedRoute>
          }
        />

        {/* Fallback route to handle invalid URLs */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
