import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AUTH_LOGIN, AUTH_SIGNUP, AUTH_ACTIVATE, AUTH_FORGOT, USERS_ME, AUTH_VERIFY_CODE, AUTH_PWD_RESET } from "./constants/urlConstants";
import RequestService from "./services/RequestService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("TOKEN_KEY"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await RequestService.get(USERS_ME, true);
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const register = async (authRequest) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_SIGNUP, authRequest);
      setUser(response.data);
      navigate("/activate");
    } catch (error) {
      console.error("Failed to register user");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (authRequest, setStatus) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_LOGIN, authRequest);
      const { token } = response.data;
      setUser(response.data.user);

      localStorage.setItem("TOKEN_KEY", token);
      setToken(token);
      
      navigate("/");
    } catch (error) {
      setStatus(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activateAccount = async (code, setStatus) => {
    setLoading(true);  
    try {
      const response = await RequestService.get(`${AUTH_ACTIVATE}/${code}`);      
      if (response && response.status === 200) {
        setUser(response.data);
        navigate("/login");
      } 
    } catch (error) {
      setStatus(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestResetCode = async (email, setStatus) => {
    try {
      const response = await RequestService.get(`${AUTH_FORGOT}/${email}`);
      console.log(response)
      return response && response.status === 200;
    } catch (error) {
      setStatus(error.message);
      throw error;
    }
  };

  const verifyResetCode = async (code, setStatus) => {
    setLoading(true);
    try {
      const response = await RequestService.get(`${AUTH_VERIFY_CODE}/${code}`);
      if (response && response.status === 200) {
        navigate("/reset-password");
      }
    } catch (error) {
      setStatus(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetRequest, setStatus) => {
    setLoading(true);
    try {
      const response = await RequestService.post(AUTH_PWD_RESET, resetRequest);
      return response && response.status === 200;
    } catch (error) {
      setStatus(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("TOKEN_KEY");
    navigate("/login");
  };

  return (
    <AuthContext.Provider 
      value={{ token, 
               user, 
               loading, 
               register, 
               login, 
               activateAccount, 
               requestResetCode, 
               verifyResetCode,
               resetPassword,
               logout 
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
