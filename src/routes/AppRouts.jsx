import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home/home";
import Mainlayout from "../layouts/Mainlayout";
import NewsDetail from "../componet/NewsDetail";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admindasbord";
import PrivateRoute from "../p/PrivateRoute";

const AppRouts = () => {
  return (
    <Routes>
      <Route element={<Mainlayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard/>
            </PrivateRoute>
          }
        />

      {/* <Route index element={<Home/>}></Route> */}
    </Routes>
  );
};

export default AppRouts;
