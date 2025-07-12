import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  spaces: any[];
}

interface Space {
  spaceId: string;
  name: string;
  description: string;
  isActive: boolean;
  config: {
    theme: string;
    features: Record<string, boolean>;
    permissions: Record<string, boolean>;
  };
  progress: {
    currentDay: number;
    totalDays: number;
    completedDays: number[];
    journalEntries: number;
  };
}

interface AuthContextType {
  user: User | null;
  activeSpace: Space | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createSpace: (spaceData: any) => Promise<Space>;
  switchSpace: (spaceId: string) => Promise<void>;
  updateSpaceConfig: (spaceId: string, config: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = 'http://localhost:3001/api/v1';

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        await refreshUser();
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      setToken(token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setActiveSpace(null);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData, activeSpace: spaceData } = response.data;
      
      await storeAuth(newToken);
      setUser(userData);
      setActiveSpace(spaceData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        email,
        name,
        password
      });

      const { token: newToken, user: userData, activeSpace: spaceData } = response.data;
      
      await storeAuth(newToken);
      setUser(userData);
      setActiveSpace(spaceData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await clearAuth();
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/me`);
      const { user: userData, activeSpace: spaceData } = response.data;
      
      setUser(userData);
      setActiveSpace(spaceData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await clearAuth();
    }
  };

  const createSpace = async (spaceData: any): Promise<Space> => {
    try {
      const response = await axios.post(`${API_BASE}/spaces/create`, spaceData);
      const newSpace = response.data.space;
      
      // Update user's spaces list
      if (user) {
        setUser({
          ...user,
          spaces: [...user.spaces, newSpace]
        });
      }
      
      return newSpace;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create space');
    }
  };

  const switchSpace = async (spaceId: string) => {
    try {
      const response = await axios.post(`${API_BASE}/spaces/switch/${spaceId}`);
      const { activeSpace: newActiveSpace } = response.data;
      
      setActiveSpace(newActiveSpace);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to switch space');
    }
  };

  const updateSpaceConfig = async (spaceId: string, config: any) => {
    try {
      const response = await axios.put(`${API_BASE}/spaces/${spaceId}/config`, config);
      const { space: updatedSpace } = response.data;
      
      // Update active space if it's the one being updated
      if (activeSpace?.spaceId === spaceId) {
        setActiveSpace(updatedSpace);
      }
      
      // Update user's spaces list
      if (user) {
        setUser({
          ...user,
          spaces: user.spaces.map(space => 
            space.spaceId === spaceId ? updatedSpace : space
          )
        });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update space config');
    }
  };

  const value: AuthContextType = {
    user,
    activeSpace,
    token,
    isLoading,
    login,
    register,
    logout,
    createSpace,
    switchSpace,
    updateSpaceConfig,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};