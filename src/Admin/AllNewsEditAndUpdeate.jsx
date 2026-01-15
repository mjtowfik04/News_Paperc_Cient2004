import React, { useState, useEffect } from "react";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const AllNewsEditAndUpdate = () => {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // ← সার্চের জন্য নতুন স্টেট

  // Fetch Categories (for dropdown)
  const fetchCategories = async () => {
    try {
      const res = await authApiClient.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Categories load error:", err);
    }
  };

  // Fetch News with Pagination + Search
  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/news/?page=${page}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`; // ← সার্চ যোগ করা
      }
      const res = await authApiClient.get(url);
      setNewsList(res.data.results || []);
      setTotalPages(Math.ceil((res.data.count || 0) / 10));
      setCurrentPage(page);
    } catch (err) {
      toast.error("নিউজ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchNews(1);
  }, []);

  // যখন সার্চ টাইপ করবো তখন অটো নতুন করে লোড হবে
  useEffect(() => {
    fetchNews(1); // সার্চ চেঞ্জ হলে প্রথম পেজ থেকে শুরু
  }, [searchQuery]);

  // Delete News
  const handleDelete = async (id) => {
    if (!window.confirm("এই নিউজটি ডিলিট করবেন? এটা আর ফিরিয়ে আনা যাবে না!")) return;

    try {
      await authApiClient.delete(`/news/${id}/`);
      toast.success("নিউজ ডিলিট হয়েছে");
      fetchNews(currentPage);
    } catch (err) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  // Quick Publish Toggle
  const togglePublish = async (news) => {
    try {
      await authApiClient.patch(`/news/${news.id}/`, {
        is_published: !news.is_published,
      });
      toast.success(
        news.is_published
          ? "নিউজ আনপাবলিশ করা হয়েছে"
          : "নিউজ পাবলিশ করা হয়েছে"
      );
      fetchNews(currentPage);
    } catch (err) {
      toast.error("স্ট্যাটাস চেঞ্জ করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        সব নিউজ ম্যানেজ করুন
      </h1>

      {/* ← নতুন সার্চ বার এখানে যোগ করা */}
      <div className="mb-8 relative max-w-xl mx-auto">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="নিউজের টাইটেল দিয়ে সার্চ করুন..."
          className="input input-bordered input-lg w-full pl-12 pr-12 text-lg shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-xl">নিউজ লোড হচ্ছে...</p>
        </div>
      ) : (
        <>
          {/* News Table */}
          <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th>টাইটেল</th>
                  <th>ক্যাটাগরি</th>
                  <th>স্ট্যাটাস</th>
                  <th>তারিখ</th>
                  <th className="text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {newsList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      {searchQuery ? "কোনো নিউজ মিলেনি" : "কোনো নিউজ পাওয়া যায়নি"}
                    </td>
                  </tr>
                ) : (
                  newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="font-medium max-w-xs truncate">
                        {item.title}
                      </td>
                      <td>{item.category?.name || "নেই"}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.is_published ? "badge-success" : "badge-error"
                          }`}
                        >
                          {item.is_published ? "পাবলিশড" : "ড্রাফট"}
                        </span>
                      </td>
                      <td>
                        {new Date(item.created_at).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => togglePublish(item)}
                            className={`btn btn-sm ${
                              item.is_published ? "btn-warning" : "btn-success"
                            }`}
                          >
                            {item.is_published ? "আনপাবলিশ" : "পাবলিশ"}
                          </button>

                          <Link
                            to={`/edit-news/${item.id}`}
                            className="btn btn-info btn-sm"
                          >
                            এডিট
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-error btn-sm"
                          >
                            ডিলিট
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => fetchNews(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                পূর্ববর্তী
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchNews(i + 1)}
                  className={`btn ${
                    currentPage === i + 1 ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => fetchNews(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
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

export default AllNewsEditAndUpdate;