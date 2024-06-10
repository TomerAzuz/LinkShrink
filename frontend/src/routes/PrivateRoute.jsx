import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loader from "../components/Loader/Loader";

const PrivateRoute = ({ component: Component }) => {
  const { token, loading } = useAuth();


  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/landing" />;
  }

  return <Component />;
};


export default PrivateRoute;