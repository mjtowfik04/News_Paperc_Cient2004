// src/hooks/authApiClient.js  বা যেখানে আছে সেখানে
import axios from "axios";

const authApiClient = axios.create({
  baseURL: "https://dpi-news.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// এই ইন্টারসেপ্টরটা ঠিক করা – প্রতিটা রিকোয়েস্টে টোকেন যোগ করবে
authApiClient.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      let accessToken;
      try {
        const parsed = JSON.parse(authTokens);
        accessToken = parsed.access;
      } catch (e) {
        console.error("Failed to parse authTokens");
      }

      if (accessToken) {
        // তোমার settings.py-এ 'JWT' আছে, তাই JWT ব্যবহার করো
        config.headers.Authorization = `JWT ${accessToken}`;
        // যদি তুমি Bearer করতে চাও, তাহলে settings.py-এ 'Bearer' করো এবং এখানে `Bearer ${accessToken}`
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authApiClient;