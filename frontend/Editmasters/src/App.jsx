import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgetPassword from './auth/Forget-password.jsx';
import ResetPassword from './auth/Reset-password.jsx';
import Profile from './pages/profile';
import Documents from './pages/documents';
import PDF from './pages/PDF';
import Image from './pages/Image';
import PDFToImage from './pages/pdf-to-image';
import ImageToPDF from './pages/image-to-pdf';
import Users from './pages/Users';
import Members from './pages/Members';
import Promotion from './pages/Promotion';
import { userAuth, AuthProvider } from './contexts/authContext.jsx';

function AppRouter() {
  const { isAuthenticated, loading } = userAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/forget-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgetPassword />} />
        <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/documents" element={isAuthenticated ? <Documents /> : <Navigate to="/login" />} />
        <Route path="/upload-pdf" element={isAuthenticated ? <PDF /> : <Navigate to="/login" />} />
        <Route path="/upload-image" element={isAuthenticated ? <Image /> : <Navigate to="/login" />} />
        <Route path="/pdf-to-image" element={isAuthenticated ? <PDFToImage /> : <Navigate to="/login" />} />
        <Route path="/image-to-pdf" element={isAuthenticated ? <ImageToPDF /> : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path="/members" element={isAuthenticated ? <Members /> : <Navigate to="/login" />} />
        <Route path="/promotion" element={isAuthenticated ? <Promotion /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;