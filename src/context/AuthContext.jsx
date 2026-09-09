import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    StorageService.setCurrentUser(currentUser);
  }, [currentUser]);

  const login = (email, password) => {
    setLoading(true);
    const users = StorageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setLoading(false);
      throw new Error('Email tidak terdaftar');
    }

    if (user.password !== password) {
      setLoading(false);
      throw new Error('Password salah');
    }

    if (user.role === 'eo' && user.status === 'pending') {
      setLoading(false);
      throw new Error('Akun EO Anda masih menunggu verifikasi/approval oleh Admin.');
    }

    if (user.role === 'eo' && user.status === 'rejected') {
      setLoading(false);
      throw new Error('Pendaftaran EO Anda telah ditolak oleh Admin.');
    }

    setCurrentUser(user);
    setLoading(false);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.setCurrentUser(null);
  };

  const registerEO = (data) => {
    return StorageService.registerEO(data);
  };

  // Quick Switcher for seamless testing during demo
  const quickSwitch = (role) => {
    const users = StorageService.getUsers();
    if (role === 'guest') {
      logout();
      return null;
    }
    const targetUser = users.find(u => u.role === role && (role !== 'eo' || u.status === 'approved'));
    if (targetUser) {
      setCurrentUser(targetUser);
      return targetUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin: currentUser?.role === 'admin',
      isEO: currentUser?.role === 'eo',
      isStaff: currentUser?.role === 'staff',
      isGuest: !currentUser,
      login,
      logout,
      registerEO,
      quickSwitch,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
