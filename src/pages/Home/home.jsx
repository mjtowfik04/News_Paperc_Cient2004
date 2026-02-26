import React, { useEffect, useState } from "react";
import authApiClient from "../../hooks/axiosInstance";
import CategoriesDropdown from "../../componet/CategoryMenu";
import NewsCard from "../../componet/NewsCard";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [leadNews, setLeadNews] = useState(null);
  const [categorizedNews, setCategorizedNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({}); // ID -> Name

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      // প্রথমে ক্যাটাগরি লোড করো
      const catRes = await authApiClient.get("/categories/");
      const categories = catRes.data || [];
      const catMap = {};
      categories.forEach((cat) => {
        catMap[cat.id] = cat.name;
      });
      setCategoryMap(catMap);

      // তারপর নিউজ লোড করো
      const res = await authApiClient.get(
        "/news/?page_size=100&ordering=-created_at"
      );
      const allNews = res.data.results || [];

      // 🔥 Lead News
      const featuredNews = allNews.find((item) => item.is_featured);
      const mainLead = featuredNews || allNews[0] || null;
      setLeadNews(mainLead);

      // 🔥 Lead বাদ দিয়ে বাকি নিউজ
      const remaining = mainLead
        ? allNews.filter((item) => item.id !== mainLead.id)
        : [];

      // 🔥 Category অনুযায়ী group করা
      const grouped = remaining.reduce((acc, news) => {
        const categoryName =
          (news.category && catMap[news.category]) || "অন্যান্য";

        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }

        acc[categoryName].push(news);
        return acc;
      }, {});

      setCategorizedNews(grouped);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  const NewsSection = ({ title, newsList }) => {
    if (!newsList || newsList.length === 0) return null;

    return (
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
  };

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

      {/* 🔥 Lead News */}
      {leadNews && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link to={`/news/${leadNews.id}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transition">
              {leadNews.image?.length > 0 ? (
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
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
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

      {/* 🔥 Category Sections (Dynamic) */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {Object.entries(categorizedNews).map(
          ([categoryName, newsList]) => (
            <NewsSection
              key={categoryName}
              title={categoryName}
              newsList={newsList}
            />
          )
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Home;