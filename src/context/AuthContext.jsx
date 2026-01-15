import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // সঠিক ইম্পোর্ট
import apiClient from "../hooks/apiClinent";          // Public (no token)
import authApiClient from "../hooks/axiosInstance";   // Authenticated (with token)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() => {
    const tokenString = localStorage.getItem("authTokens");
    if (!tokenString) return null;
    try {
      return JSON.parse(tokenString);
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState(null);

  // Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      const response = await authApiClient.get("/users/me/"); // Djoser correct path
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching user:", error.response?.data || error);
      if (error.response?.status === 401) {
        logoutUser();
      }
    }
  };

  // Login
  const loginUser = async (userdata) => {
    try {
      const response = await apiClient.post("/auth/jwt/create/", userdata);
      if (response.status === 200) {
        const tokens = response.data; // { access, refresh }
        setAuthTokens(tokens);
        localStorage.setItem("authTokens", JSON.stringify(tokens));
        await fetchUserProfile();
        navigate("/dashboard"); // বা /admin যেখানে চাও
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  // Logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  // Auto refresh token on 401 (expired access token)
  useEffect(() => {
    const requestInterceptor = authApiClient.interceptors.request.use(
      (config) => {
        if (authTokens?.access) {
          config.headers.Authorization = `JWT ${authTokens.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = authApiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === "token_not_valid"
        ) {
          const storedTokens = localStorage.getItem("authTokens");
          if (storedTokens) {
            try {
              const parsed = JSON.parse(storedTokens);
              const refreshResponse = await apiClient.post("/auth/jwt/refresh/", {
                refresh: parsed.refresh,
              });

              const newTokens = {
                access: refreshResponse.data.access,
                refresh: parsed.refresh,
              };

              setAuthTokens(newTokens);
              localStorage.setItem("authTokens", JSON.stringify(newTokens));

              // Retry the original request with new token
              error.config.headers.Authorization = `JWT ${refreshResponse.data.access}`;
              return authApiClient(error.config);
            } catch (refreshError) {
              console.log("Refresh token failed or expired");
              logoutUser();
            }
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      authApiClient.interceptors.request.eject(requestInterceptor);
      authApiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [authTokens]);

  // Fetch user when tokens change
  useEffect(() => {
    if (authTokens?.access) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [authTokens]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    fetchUserProfile,
    isAuthenticated: !!user && !!authTokens,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;