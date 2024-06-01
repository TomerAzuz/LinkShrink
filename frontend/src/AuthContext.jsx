import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AUTH_LOGIN, 
         AUTH_SIGNUP, 
         AUTH_ACTIVATE, 
         AUTH_FORGOT, 
         USERS_ME, 
         AUTH_VERIFY_CODE, 
         AUTH_PWD_RESET 
        } from "./constants/urlConstants";
import RequestService from "./services/RequestService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("TOKEN_KEY"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await RequestService.get(USERS_ME, true);
        setUser(response.data);
      } catch (error) {
        console.error("Unauthenticated user");
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
      navigate("/activate");
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
      const { token } = response.data;
      setUser(response.data.user);
      
      localStorage.setItem("TOKEN_KEY", token);
      setToken(token);
      
      navigate("/");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activateAccount = async (code) => {
    setLoading(true);  
    try {
      const response = await RequestService.get(`${AUTH_ACTIVATE}/${code}`);      
      if (response && response.status === 200) {
        setUser(response.data);
        navigate("/login");
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
      console.log(response)
      return response && response.status === 200;
    } catch (error) {
      throw error;
    }
  };

  const verifyResetCode = async (code) => {
    setLoading(true);
    try {
      const response = await RequestService.get(`${AUTH_VERIFY_CODE}/${code}`);
      if (response && response.status === 200) {
        navigate("/reset-password");
      }
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
