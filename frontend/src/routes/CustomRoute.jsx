import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Loader from '../components/Loader/Loader';

const CustomRoute = ({ component: Component }) => {
  const { token, user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (user && user.active && token) return <Navigate to="/" />;
  return <Component />;
};

export default CustomRoute;
