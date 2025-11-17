// src/hooks/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://dpi-news.vercel.app/api/",
});


export default apiClient;
