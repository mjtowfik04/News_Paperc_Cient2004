import { createContext, useEffect, useState } from "react";
import apiClient from "../hooks/axiosInstance";
import { useNavigate } from "react-router"; // <-- useNavigate ইম্পোর্ট করুন

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // <-- এটা ব্যবহার করুন

  const getToken = () => {
    const tokenString = localStorage.getItem("authTokens");
    if (!tokenString) return null;
    try {
      return JSON.parse(tokenString);
    } catch (e) {
      return null;
    }
  };

  const [authTokens, setAuthTokens] = useState(getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authTokens?.access) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [authTokens]);

  const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get("/users/me/");  // authApiClient ব্যবহার করো
    setUser(response.data);
  } catch (error) {
    console.log("Error Fetching user", error.response?.data || error);
    if (error.response?.status === 401) {
      logoutUser();
    }
  }
};

  const loginUser = async (userdata) => {
    try {
      const response = await apiClient.post("/auth/jwt/create/", userdata);
      if (response.status === 200) {
        const tokens = response.data; // { access: "...", refresh: "..." }
        setAuthTokens(tokens);
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        await fetchUserProfile();
        navigate("/dashboard"); // লগইন সাকসেস হলে কোথায় যাবে
      }
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/"); // হোমে বা লগইন পেজে রিডাইরেক্ট
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