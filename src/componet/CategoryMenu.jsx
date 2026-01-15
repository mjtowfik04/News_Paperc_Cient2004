import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../hooks/axiosInstance";

export default function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/categories/")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("ক্যাটাগরি লোড করতে সমস্যা:", err));
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.length === 0 ? (
            <p className="text-gray-500 whitespace-nowrap">ক্যাটাগরি লোড হচ্ছে...</p>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="px-6 py-3 rounded-full font-semibold text-base whitespace-nowrap transition-all duration-300 shadow-md bg-gray-100 text-gray-800 hover:bg-red-600 hover:text-white hover:shadow-red-500/50 flex-shrink-0"
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}