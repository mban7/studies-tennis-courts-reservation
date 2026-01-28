import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';
import type { User, LoginCredentials, RegisterData } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authApi.getMe();
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      await authApi.login(credentials);
      await fetchUser();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd logowania');
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      await authApi.register(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd rejestracji');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Błąd wylogowania:', err);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    refetch: fetchUser,
  };
}
