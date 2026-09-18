import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('zero_waste_token'));
  const [loading, setLoading] = useState(true);

  // Load current user profile on boot
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('zero_waste_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response?.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.warn('Failed to restore auth session:', error.message);
      localStorage.removeItem('zero_waste_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data?.token && data?.user) {
        localStorage.setItem('zero_waste_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      throw new Error('Invalid server response');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check credentials.');
      return { success: false, error: error.message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      if (data?.token && data?.user) {
        localStorage.setItem('zero_waste_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome to Zero Waste, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      throw new Error('Registration failed');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      return { success: false, error: error.message };
    }
  };

  // 1-Click Quick Demo Login Switcher
  const loginAsDemo = async (role = 'donor') => {
    const demoCredentials = {
      donor: { email: 'donor@zerowaste.org', password: 'password123' },
      volunteer: { email: 'volunteer@zerowaste.org', password: 'password123' },
      ngo: { email: 'ngo@zerowaste.org', password: 'password123' },
      admin: { email: 'admin@zerowaste.org', password: 'password123' },
    };

    const creds = demoCredentials[role] || demoCredentials.donor;
    return await login(creds.email, creds.password);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('zero_waste_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginAsDemo,
        logout,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
