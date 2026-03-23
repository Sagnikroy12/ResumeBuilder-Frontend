import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const register = async (email, password) => {
    const response = await authApi.register(email, password);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
