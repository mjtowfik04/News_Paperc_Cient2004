import React, { useState, useEffect } from "react";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const AllNewsEditAndUpdate = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch News with Pagination + Search
  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/news/?page=${page}`;

      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
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
    fetchNews(1);
  }, []);

  useEffect(() => {
    fetchNews(1);
  }, [searchQuery]);

  // Delete News
  const handleDelete = async (id) => {
    if (!window.confirm("এই নিউজটি ডিলিট করবেন?")) return;

    try {
      await authApiClient.delete(`/news/${id}/`);
      toast.success("নিউজ ডিলিট হয়েছে");
      fetchNews(currentPage);
    } catch (err) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  // Publish Toggle
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
      toast.error("স্ট্যাটাস পরিবর্তন করা যায়নি");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        সব নিউজ ম্যানেজ করুন
      </h1>

      {/* Search */}
      <div className="mb-8 relative max-w-xl mx-auto">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="নিউজের টাইটেল দিয়ে সার্চ করুন..."
          className="input input-bordered w-full pl-12"
        />
      </div>

      {loading ? (
        <p className="text-center py-20">নিউজ লোড হচ্ছে...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th>টাইটেল</th>
                <th>স্ট্যাটাস</th>
                <th>তারিখ</th>
                <th className="text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10">
                    কোনো নিউজ পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                newsList.map((item) => (
                  <tr key={item.id}>
                    <td className="truncate max-w-xs">{item.title}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.is_published
                            ? "badge-success"
                            : "badge-error"
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
                          className="btn btn-sm btn-warning"
                        >
                          টগল
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
      )}

      <ToastContainer />
    </div>
  );
};

export default AllNewsEditAndUpdate;
