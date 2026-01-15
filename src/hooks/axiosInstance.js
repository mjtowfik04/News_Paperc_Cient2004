import axios from "axios";

const authApiClient = axios.create({
  baseURL: "https://dpi-news.vercel.app/api/",
});

// Request Interceptor – টোকেন যোগ + FormData transform skip
authApiClient.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      try {
        const parsed = JSON.parse(authTokens);
        if (parsed?.access) {
          config.headers.Authorization = `JWT ${parsed.access}`;
        }
      } catch (e) {
        console.error("Invalid authTokens");
      }
    }

    // ← এটা সবচেয়ে গুরুত্বপূর্ণ: FormData হলে JSON transform করো না
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];  // axios অটো boundary সেট করবে
      // transformRequest skip করার জন্য
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default authApiClient;