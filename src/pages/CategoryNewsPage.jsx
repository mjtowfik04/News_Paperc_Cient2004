import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import NewsCard from "../componet/NewsCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryNewsPage = () => {
  const { id } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [categoryName, setCategoryName] = useState("ক্যাটাগরি");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 12; // প্রতি পেজে ১২টা নিউজ

  // ক্যাটাগরির নাম লোড
  const fetchCategoryName = async () => {
    try {
      const res = await authApiClient.get(`/categories/${id}/`);
      setCategoryName(res.data.name || "ক্যাটাগরি");
    } catch (err) {
      console.error("Category name error:", err);
      setCategoryName("ক্যাটাগরি");
    }
  };

  // ক্যাটাগরির নিউজ লোড (প্যাগিনেশন সহ)
  const fetchCategoryNews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await authApiClient.get(`/news/?category=${id}&page=${page}&page_size=${PAGE_SIZE}`);
      const data = res.data;

      setNewsList(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error:", err);
      toast.error("নিউজ লোড করতে সমস্যা হয়েছে");
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategoryName();
      fetchCategoryNews(1);
    }
  }, [id]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchCategoryNews(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-32 pt-20">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-xl">নিউজ লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-primary">
        {categoryName} - সব নিউজ ({newsList.length > 0 ? `পেজ ${currentPage}` : "০"})
      </h1>

      {newsList.length === 0 ? (
        <p className="text-center text-gray-500 text-2xl py-20">
          এই ক্যাটাগরিতে এখনো কোনো নিউজ নেই।
        </p>
      ) : (
        <>
          {/* নিউজ গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {newsList.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* প্যাগিনেশন */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                পূর্ববর্তী
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
              >
                পরবর্তী
              </button>
            </div>
          )}
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CategoryNewsPage;