import { createContext, useEffect, useState } from "react";
import apiClient from "../hooks/apiClinent"; 
import { Navigate } from "react-router";
// spelling ঠিক করো: apiClient.js ফাইলেও spelling ঠিক থাকা দরকার

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load tokens from localStorage
  const getToken = () => {
    const token = localStorage.getItem("authTokens");
    return token ? JSON.parse(token) : null;
  };

  const [authTokens, setAuthTokens] = useState(getToken());
  const [user, setUser] = useState(null);

  // Load user on page refresh if token exists
  useEffect(() => {
    if (authTokens?.access) {
      fetchUserProfile();
    }
  }, [authTokens]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("auth/users/me/", {
        headers: { Authorization: `JWT ${authTokens?.access}` },
      });
      setUser(response.data);
    } catch (error) {
      console.log("Error Fetching user", error);
    }
  };

  // Login user
  const loginUser = async (userdata) => {
    try {
      const response = await apiClient.post("/auth/jwt/create/", userdata);

      if (response.status === 200) {
        setAuthTokens(response.data);
        localStorage.setItem("authTokens", JSON.stringify(response.data));

        // Fetch user immediately after login
        fetchUserProfile();
      }
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
    }
  };

  // Logout user
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    Navigate("/"); 
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    fetchUserProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
