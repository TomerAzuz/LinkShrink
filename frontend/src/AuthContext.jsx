import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_ACTIVATE,
  AUTH_FORGOT,
  USERS_ME,
  AUTH_VERIFY_CODE,
  AUTH_PWD_RESET,
  AUTH_REFRESH,
} from './constants/urlConstants';
import RequestService from './services/RequestService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('TOKEN_KEY') || '');
  const [loading, setLoading] = useState(false);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await RequestService.get(USERS_ME, true);
        setUser(response.data);
      } catch (error) {
        logout();
        console.error('unauthenticated');
        return;
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const register = async (authRequest) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_SIGNUP, authRequest);
      setUser(response.data);
      navigate('/activate');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (authRequest) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_LOGIN, authRequest);
      const { token, refreshToken, expiresIn } = response.data;
      setUser(response.data.user);

      localStorage.setItem('TOKEN_KEY', token);
      setToken(token);
      Cookies.set('REFRESH_TOKEN_KEY', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
        httpOnly: true,
      });

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = setInterval(
        handleRefreshToken,
        expiresIn - 60000
      );

      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = Cookies.get('REFRESH_TOKEN_KEY');
      const response = await RequestService.post(AUTH_REFRESH, {
        refreshToken,
      });
      const {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn,
      } = response.data;

      localStorage.setItem('TOKEN_KEY', newToken);
      Cookies.set('REFRESH_TOKEN_KEY', newRefreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
        httpOnly: true,
      });
      setToken(newToken);

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = setInterval(
        handleRefreshToken,
        expiresIn - 60000
      );
    } catch (error) {
      console.error('Failed to refresh token', error);
      logout();
    }
  };

  const activateAccount = async (code) => {
    setLoading(true);
    try {
      const response = await RequestService.get(`${AUTH_ACTIVATE}/${code}`);
      if (response) {
        setUser(response.data);
        navigate('/login');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestResetCode = async (email) => {
    try {
      const response = await RequestService.get(`${AUTH_FORGOT}/${email}`);
      return response && response.status === 200;
    } catch (error) {
      throw error;
    }
  };

  const verifyResetCode = async (code) => {
    setLoading(true);
    try {
      const response = await RequestService.get(`${AUTH_VERIFY_CODE}/${code}`);
      return response && response.status === 200;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetRequest) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_PWD_RESET, resetRequest);
      return response && response.status === 200;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    Cookies.remove('REFRESH_TOKEN_KEY');
    localStorage.removeItem('TOKEN_KEY');
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    navigate('/landing');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        register,
        login,
        handleRefreshToken,
        activateAccount,
        requestResetCode,
        verifyResetCode,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
