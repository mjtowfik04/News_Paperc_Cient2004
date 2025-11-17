import { useState, useEffect } from "react";
import axios from "../../hooks/axiosInstance";
import CategoriesDropdown from "../../componet/CategoryMenu";
import NewsCard from "../../componet/NewsCard";

const Home = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("/news/")
      .then((res) => setNews(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Categories & All News */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold font-extrabold text-gray-800">Categories</h2>
        
      </div>

      {/* Categories Dropdown */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <CategoriesDropdown />
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          All News
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => <NewsCard key={item.id} news={item} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No news available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
