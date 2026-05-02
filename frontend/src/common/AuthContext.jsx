import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getDashboardPath = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Admin': return '/admin';
      case 'Police Officer': return '/police';
      case 'Lab Analyst': return '/lab';
      case 'Evidence Collector': return '/evidence';
      case 'Court Official': return '/court';
      default: return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, dashboardPath: getDashboardPath() }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
