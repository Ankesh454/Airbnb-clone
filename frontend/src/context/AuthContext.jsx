import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wanderlust_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('wanderlust_token');
    const storedUser = localStorage.getItem('wanderlust_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('wanderlust_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('wanderlust_token', token);
    localStorage.setItem('wanderlust_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wanderlust_token');
    localStorage.removeItem('wanderlust_user');
    setUser(null);
  };

  const toggleWishlist = (listing) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === listing._id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item._id !== listing._id);
      } else {
        updated = [...prev, listing];
      }
      localStorage.setItem('wanderlust_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
