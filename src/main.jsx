import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouts from "./routes/AppRouts.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";  // সঠিক ইম্পোর্ট

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouts />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);