import React, { useEffect, useState } from "react";
import authApiClient from "../../hooks/axiosInstance";
import CategoriesDropdown from "../../componet/CategoryMenu";
import NewsCard from "../../componet/NewsCard";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [leadNews, setLeadNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const res = await authApiClient.get("/news/?page_size=100&ordering=-created_at");
      const allNews = res.data.results || [];

      // লিড নিউজ – সর্বশেষ ফিচার্ড (ordering দিয়ে সর্বশেষ আগে আসবে)
      const featuredNews = allNews.find((item) => item.is_featured);
      setLeadNews(featuredNews || allNews[0] || null);

      // বাকি নিউজ – নতুন থেকে পুরাতন (ordering ইতিমধ্যে আছে)
      const remaining = featuredNews
        ? allNews.filter((item) => item.id !== featuredNews.id)
        : allNews.slice(1);
      setOtherNews(remaining);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  const NewsSection = ({ title, newsList }) => (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 border-l-8 border-red-600 pl-6 text-gray-800">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsList.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pt-20 text-center py-32">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-2xl">নিউজ লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoriesDropdown />

      {/* লিড নিউজ */}
      {leadNews && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link to={`/news/${leadNews.id}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition">
              {leadNews.image && leadNews.image.length > 0 ? (
                <img
                  src={leadNews.image[0].image}
                  alt={leadNews.title}
                  className="w-full h-96 md:h-[700px] object-cover"
                />
              ) : (
                <div className="w-full h-96 md:h-[700px] bg-gray-300 flex items-center justify-center">
                  <p className="text-4xl text-gray-600">No Image</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    {leadNews.title}
                  </h1>
                  <p className="text-lg md:text-xl opacity-90 line-clamp-3">
                    {leadNews.content.substring(0, 300)}...
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* সেকশনগুলো – নতুন নিউজ উপরে */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <NewsSection title="বাংলাদেশ" newsList={otherNews.slice(0, 6)} />
        <NewsSection title="আন্তর্জাতিক" newsList={otherNews.slice(6, 12)} />
        <NewsSection title="রাজনীতি" newsList={otherNews.slice(12, 18)} />
        <NewsSection title="খেলাধুলা" newsList={otherNews.slice(18, 24)} />
        <NewsSection title="বিনোদন" newsList={otherNews.slice(24, 30)} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Home;