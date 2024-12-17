import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './AuthContext';
import { useContext, useState } from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function MainRoutes() {
  const { userLogged } = useContext(AuthContext);

  if (userLogged === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        {/* Protected Routes */}
        <Route
          path='/dashboard'
          element={
            userLogged ? <Dashboard /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/dashboard/:collectionId'
          element={
            userLogged ? <Dashboard /> : <Navigate to='/login' replace />
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
