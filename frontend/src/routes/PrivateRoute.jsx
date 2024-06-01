import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loader from "../components/Loader/Loader";

const PrivateRoute = ({ component: Component }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user || !token) return <Navigate to="/landing" />;
  if (user && !user.active) return <Navigate to="/activate" />;
  return <Component />;
};


export default PrivateRoute;