import React, { useState, useEffect } from "react";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeft } from "react-icons/fi";

const AllNewsEditAndUpdate = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = `/news/?page=1`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await authApiClient.get(url);
      setNewsList(res.data.results || []);
    } catch {
      toast.error("নিউজ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("এই নিউজটি ডিলিট করবেন?")) return;

    try {
      await authApiClient.delete(`/news/${id}/`);
      toast.success("নিউজ ডিলিট হয়েছে");
      fetchNews();
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const togglePublish = async (news) => {
    try {
      await authApiClient.patch(`/news/${news.id}/`, {
        is_published: !news.is_published,
      });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
      fetchNews();
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন করা যায়নি");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 text-black">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
          >
            <FiArrowLeft />
            ব্যাক যান
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          সব নিউজ ম্যানেজ করুন
        </h1>

        {/* Search */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নিউজের টাইটেল দিয়ে সার্চ করুন..."
            className="input input-bordered w-full pl-12 border-gray-300 focus:border-black focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center py-20">নিউজ লোড হচ্ছে...</p>
        ) : newsList.length === 0 ? (
          <p className="text-center py-20">কোনো নিউজ পাওয়া যায়নি</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">টাইটেল</th>
                    <th className="py-3 px-4 text-left">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-left">তারিখ</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{item.title}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.is_published
                              ? "bg-black text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {item.is_published ? "পাবলিশড" : "ড্রাফট"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {new Date(item.created_at).toLocaleDateString("bn-BD")}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => togglePublish(item)}
                            className="px-3 py-1 border border-black rounded-md hover:bg-black hover:text-white transition"
                          >
                            টগল
                          </button>

                          <Link
                            to={`/edit-news/${item.id}`}
                            className="px-3 py-1 border border-black rounded-md hover:bg-black hover:text-white transition"
                          >
                            এডিট
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 border border-black rounded-md hover:bg-black hover:text-white transition"
                          >
                            ডিলিট
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-5">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50"
                >
                  <h2 className="font-bold mb-2">{item.title}</h2>

                  <p className="text-sm mb-2">
                    স্ট্যাটাস:{" "}
                    {item.is_published ? "পাবলিশড" : "ড্রাফট"}
                  </p>

                  <p className="text-sm mb-4">
                    {new Date(item.created_at).toLocaleDateString("bn-BD")}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => togglePublish(item)}
                      className="flex-1 border border-black rounded-md py-1 hover:bg-black hover:text-white transition"
                    >
                      টগল
                    </button>

                    <Link
                      to={`/edit-news/${item.id}`}
                      className="flex-1 border border-black rounded-md py-1 text-center hover:bg-black hover:text-white transition"
                    >
                      এডিট
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full border border-black rounded-md py-1 hover:bg-black hover:text-white transition"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default AllNewsEditAndUpdate;