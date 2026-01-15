import React, { useState, useEffect } from "react";
import authApiClient from "../hooks/axiosInstance"; // authenticated client
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriesAdd = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await authApiClient.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      toast.error("ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("ক্যাটাগরির নাম দিন!");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // ← PATCH ব্যবহার করা হয়েছে (partial update)
        await authApiClient.patch(`/categories/${editingId}/`, { name });
        toast.success("ক্যাটাগরি আপডেট হয়েছে!");
      } else {
        // Add new
        await authApiClient.post("/categories/", { name });
        toast.success("নতুন ক্যাটাগরি যোগ হয়েছে!");
      }
      setName("");
      setEditingId(null);
      fetchCategories(); // রিফ্রেশ লিস্ট
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      const errorMsg = err.response?.data?.name?.[0] || "সমস্যা হয়েছে, আবার চেষ্টা করুন";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Edit Category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ফর্মে স্ক্রল
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("এই ক্যাটাগরি ডিলিট করবেন? এটা থেকে নিউজও প্রভাবিত হতে পারে!")) return;

    try {
      await authApiClient.delete(`/categories/${id}/`);
      toast.success("ক্যাটাগরি ডিলিট হয়েছে");
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        ক্যাটাগরি ম্যানেজমেন্ট
      </h1>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8 border">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingId ? "ক্যাটাগরি এডিট করুন" : "নতুন ক্যাটাগরি যোগ করুন"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ক্যাটাগরির নাম লিখুন (যেমন: রাজনীতি)"
            className="input input-bordered input-primary flex-1"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary min-w-32"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  লোডিং...
                </>
              ) : editingId ? (
                "আপডেট করুন"
              ) : (
                "যোগ করুন"
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setName("");
                  setEditingId(null);
                }}
                className="btn btn-ghost"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow-xl rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          বিদ্যমান ক্যাটাগরি ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">
              এখনো কোনো ক্যাটাগরি যোগ করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <span className="text-xl font-medium text-gray-800">
                  {cat.name}
                </span>
                <div className="flex gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="btn btn-warning btn-sm"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="btn btn-error btn-sm"
                  >
                    ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CategoriesAdd;