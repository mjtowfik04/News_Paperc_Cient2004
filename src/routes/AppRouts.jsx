import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home/home";
import Mainlayout from "../layouts/Mainlayout";
import NewsDetail from "../componet/NewsDetail";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admindasbord";
import PrivateRoute from "../p/PrivateRoute";
import AddNews from "../Admin/AddNews";
import UploadImages from "../pages/UploadImages";
import CategoriesAdd from "../Admin/CategoriesAdd";
import AllNewsEditAndUpdate from "../Admin/AllNewsEditAndUpdeate";
import CategoryNewsPage from "../pages/CategoryNewsPage";

const AppRouts = () => {
  return (
    <Routes>
      <Route element={<Mainlayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="/category/:id" element={<CategoryNewsPage/>} />
      </Route>
      <Route
        path="/dashboard"
        element={
          // <PrivateRoute>
          <AdminDashboard />
          // </PrivateRoute>
        }
      />
      <Route
        path="/news/add"
        element={
          // <PrivateRoute>
          <AddNews />
          //<PrivateRoute/>
        }
      />
      <Route
        path="/upload-images/:newsId"
        element={
          <PrivateRoute>
            <UploadImages />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories-manage"
        element={
          <PrivateRoute>
            <CategoriesAdd />
          </PrivateRoute>
        }
      />
      <Route
        path="/all-news-manage"
        element={
          <PrivateRoute>
            <AllNewsEditAndUpdate />
          </PrivateRoute>
        }
      />

      {/* <Route index element={<Home/>}></Route> */}
    </Routes>
  );
};

export default AppRouts;
