import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = storage.get(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Get all registered users
    const users = storage.get(STORAGE_KEYS.USERS, []);
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        createdAt: foundUser.createdAt
      };
      setUser(userData);
      storage.save(STORAGE_KEYS.USER, userData);
      return { success: true, message: 'Login successful' };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    // Get all registered users
    const users = storage.get(STORAGE_KEYS.USERS, []);
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.save(STORAGE_KEYS.USERS, users);

    // Auto login after registration
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
    setUser(userData);
    storage.save(STORAGE_KEYS.USER, userData);

    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.USER);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storage.save(STORAGE_KEYS.USER, updatedUser);

    // Also update in users array
    const users = storage.get(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      storage.save(STORAGE_KEYS.USERS, users);
    }
  };

  const updatePassword = (currentPassword, newPassword) => {
    // Get all registered users
    const users = storage.get(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    const foundUser = users[userIndex];
    
    // Verify current password
    if (foundUser.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Update password
    users[userIndex] = { ...foundUser, password: newPassword };
    storage.save(STORAGE_KEYS.USERS, users);

    return { success: true, message: 'Password updated successfully' };
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

