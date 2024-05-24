import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const CustomRoute = ({ component: Component }) => {
  const { user } = useAuth();

  return user ? <Navigate to='/' /> : <Component />;
};

export default CustomRoute;
