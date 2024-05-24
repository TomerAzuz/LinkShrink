import React, { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { USERS_ME } from './constants/urlConstants';
import RequestService from './services/RequestService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('TOKEN_KEY'));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await RequestService.get(USERS_ME, true);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user');
      }
    };

    if (token) {
      fetchUser();
    }
  }, []);

  const login = async (authRequest, endpoint) => {
    try {
      setLoading(true);
      const response = await RequestService.post(endpoint, authRequest);
      const { token } = response.data;

      setToken(token);
      localStorage.setItem('TOKEN_KEY', token);

      navigate('/');
    } catch (error) {
      console.error('Login failed: ', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('TOKEN_KEY');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
