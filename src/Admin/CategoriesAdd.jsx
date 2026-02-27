import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";

const CategoriesAdd = () => {
  const navigate = useNavigate();

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
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("ক্যাটাগরির নাম দিন!");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await authApiClient.patch(`/categories/${editingId}/`, { name });
        toast.success("ক্যাটাগরি আপডেট হয়েছে!");
      } else {
        await authApiClient.post("/categories/", { name });
        toast.success("নতুন ক্যাটাগরি যোগ হয়েছে!");
      }

      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই ক্যাটাগরি ডিলিট করবেন?")) return;

    try {
      await authApiClient.delete(`/categories/${id}/`);
      toast.success("ক্যাটাগরি ডিলিট হয়েছে");
      fetchCategories();
    } catch (err) {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost mb-6 flex items-center gap-2"
      >
        <FiArrowLeft />
        Back
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        ক্যাটাগরি ম্যানেজ করুন
      </h1>

      {/* Form Box */}
      <div className="bg-white shadow-lg rounded-xl p-6 border mb-10">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          {editingId ? "ক্যাটাগরি এডিট করুন" : "নতুন ক্যাটাগরি যোগ করুন"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ক্যাটাগরির নাম লিখুন..."
            className="input input-bordered w-full flex-1"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary min-w-[110px]"
            >
              {loading
                ? "লোডিং..."
                : editingId
                ? "আপডেট"
                : "যোগ করুন"}
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

      {/* List Box */}
      <div className="bg-white shadow-lg rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          বিদ্যমান ক্যাটাগরি ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            কোনো ক্যাটাগরি পাওয়া যায়নি
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <span className="text-lg font-medium text-gray-800">
                  {cat.name}
                </span>

                <div className="flex gap-2 mt-3 sm:mt-0">
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