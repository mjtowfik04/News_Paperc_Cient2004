import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "../hooks/axiosInstance";

export default function CategoriesDropdown() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get("/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedCategory(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-4">
      {/* Horizontal Category List */}
      <div className="flex gap-4 overflow-x-auto mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory?.id === cat.id
                ? "bg-red-600 text-white"
                : "bg-white text-gray-800"
            } hover:bg-red-500 hover:text-white transition cursor-pointer`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Selected Category News */}
      {selectedCategory && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-left">
            {selectedCategory.name} News
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedCategory.news.length === 0 ? (
              <p className="text-gray-400">No news available in this category.</p>
            ) : (
              selectedCategory.news.map((news) => (
                <button
                  key={news.id}
                  onClick={() => handleNewsClick(news.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition shadow-sm hover:shadow-md cursor-pointer"
                >
                  {news.title.length > 20
                    ? news.title.slice(0, 20) + "..."
                    : news.title}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
