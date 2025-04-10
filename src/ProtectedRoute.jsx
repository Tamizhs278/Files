// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/" />;
}
