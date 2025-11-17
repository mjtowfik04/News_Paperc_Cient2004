import { useContext } from "react";
import useAuthContext from "../context/AuthContext";
import { Navigate } from "react-router";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
      const { user } = useContext(AuthContext);

    const useAuthContext = () => useContext(AuthContext);
  if (user === null) return <Navigate to="/"></Navigate>
  return user ? children : <Navigate to="/login"></Navigate>;
};

export default PrivateRoute;