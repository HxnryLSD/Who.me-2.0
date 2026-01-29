import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authAPI.getMe();
          setCurrentUser(response.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = useCallback(async (username, email, password, displayName) => {
    try {
      const response = await authAPI.register(username, email, password, displayName);
      
      // Save token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCurrentUser(response.user);

      return response.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registrierung fehlgeschlagen';
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async (usernameOrEmail, password) => {
    try {
      const response = await authAPI.login(usernameOrEmail, password);
      
      // Save token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCurrentUser(response.user);

      return response.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login fehlgeschlagen';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  }, []);

  const updateUserProfile = useCallback(async (updates) => {
    if (!currentUser) return;

    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = response.user;
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [currentUser]);

  const getUserProfile = useCallback(async (username) => {
    try {
      // This will be used for viewing public profiles
      // For now, we'll use the public users list
      const response = await userAPI.getPublicUsers();
      const user = response.users.find(u => u.username === username);
      return user || null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }, []);

  const getPublicUsers = useCallback(async () => {
    try {
      const response = await userAPI.getPublicUsers();
      return response.users;
    } catch (error) {
      console.error('Failed to get public users:', error);
      return [];
    }
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    getUserProfile,
    getPublicUsers,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
