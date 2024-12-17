import React, { createContext, useState, useEffect } from 'react';
import { checkAuth } from './axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userLogged, setUserLogged] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await checkAuth();
        setUserLogged(result !== 'Unauthorized - No Token Provided');
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserLogged(false); // Default to not logged in on error
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userLogged, setUserLogged }}>
      {children}
    </AuthContext.Provider>
  );
};
