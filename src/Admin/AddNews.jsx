import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import apiClient from "../hooks/apiClinent";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNews = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/categories/");
        setCategories(res.data || []);
      } catch (error) {
        toast.error("ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
      }
    };
    fetchCategories();
  }, []);

  const handleProductAdd = async (data) => {
    try {
      const formData = {
        title: data.title.trim(),
        content: data.content.trim(),
        category: Number(data.category),
        is_published: true,
        is_featured: data.is_featured || false,
      };

      const productRes = await authApiClient.post("/news/", formData);
      const newsId = productRes.data.id;

      toast.success("নিউজ সফলভাবে তৈরি হয়েছে! এখন ছবি আপলোড করুন।");
      reset();
      navigate(`/upload-images/${newsId}`);
    } catch (error) {
      const msg =
        error.response?.data?.title?.[0] ||
        error.response?.data?.content?.[0] ||
        error.response?.data?.category?.[0] ||
        "নিউজ তৈরি করতে সমস্যা হয়েছে";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost mb-6 flex items-center gap-2 text-amber-50 hover:text-blue-600"
      >
        <FiArrowLeft size={20} />
        Back
      </button>

      {/* White Card Box */}
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-200">

        <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
          নতুন নিউজ যোগ করুন
        </h2>

        <form onSubmit={handleSubmit(handleProductAdd)} className="space-y-6">

          {/* টাইটেল */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700 text-lg">
                নিউজের টাইটেল
              </span>
            </label>
            <input
              {...register("title", { required: "টাইটেল দিন" })}
              type="text"
              placeholder="এখানে টাইটেল লিখুন..."
              className="input input-bordered input-primary w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* কন্টেন্ট */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700 text-lg">
                বিস্তারিত কন্টেন্ট
              </span>
            </label>
            <textarea
              {...register("content", { required: "কন্টেন্ট লিখুন" })}
              placeholder="নিউজের বিস্তারিত লিখুন..."
              className="textarea textarea-bordered w-full h-56 resize-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* ক্যাটাগরি */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700 text-lg">
                ক্যাটাগরি
              </span>
            </label>
            <select
              {...register("category", { required: "ক্যাটাগরি সিলেক্ট করুন" })}
              className="select select-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-200"
              defaultValue=""
            >
              <option value="" disabled>
                একটি ক্যাটাগরি নির্বাচন করুন
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* ফিচার্ড চেকবক্স */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                {...register("is_featured")}
                className="checkbox checkbox-primary"
              />
              <span className="label-text font-medium text-gray-700">
                ফিচার্ড নিউজ (হোম পেজে লিড হিসেবে দেখাবে)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-14"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  তৈরি হচ্ছে...
                </>
              ) : (
                "নিউজ তৈরি করুন & ছবি আপলোড করুন"
              )}
            </button>
          </div>

        </form>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default AddNews;