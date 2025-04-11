// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login';
import HomePage from './Home';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Loginhistory from './LoginHistory'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/loginhistory"
            element={
              <ProtectedRoute>
                <Loginhistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
