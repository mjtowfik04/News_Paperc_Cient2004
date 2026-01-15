import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
        console.error("Category load error:", error);
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
        is_featured: data.is_featured || false, // ← ফিচার্ড যোগ করা
      };

      const productRes = await authApiClient.post("/news/", formData);
      const newsId = productRes.data.id;

      toast.success("নিউজ সফলভাবে তৈরি হয়েছে! এখন ছবি আপলোড করুন।");
      reset();

      navigate(`/upload-images/${newsId}`);
    } catch (error) {
      console.error("News create error:", error.response?.data || error);
      const msg =
        error.response?.data?.title?.[0] ||
        error.response?.data?.content?.[0] ||
        error.response?.data?.category?.[0] ||
        "নিউজ তৈরি করতে সমস্যা হয়েছে";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        নতুন নিউজ যোগ করুন
      </h2>

      <form onSubmit={handleSubmit(handleProductAdd)} className="space-y-6">
        {/* টাইটেল */}
        <div>
          <label className="label">
            <span className="label-text font-semibold text-lg">নিউজের টাইটেল</span>
          </label>
          <input
            {...register("title", { required: "টাইটেল দিন" })}
            type="text"
            placeholder="এখানে টাইটেল লিখুন..."
            className="input input-bordered input-lg w-full"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* কন্টেন্ট */}
        <div>
          <label className="label">
            <span className="label-text font-semibold text-lg">বিস্তারিত কন্টেন্ট</span>
          </label>
          <textarea
            {...register("content", { required: "কন্টেন্ট লিখুন" })}
            placeholder="নিউজের বিস্তারিত লিখুন..."
            className="textarea textarea-bordered textarea-lg w-full h-64 resize-none"
            rows="10"
          ></textarea>
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        {/* ক্যাটাগরি */}
        <div>
          <label className="label">
            <span className="label-text font-semibold text-lg">ক্যাটাগরি</span>
          </label>
          <select
            {...register("category", { required: "ক্যাটাগরি সিলেক্ট করুন" })}
            className="select select-bordered w-full"
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
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* ফিচার্ড নিউজ চেকবক্স */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              {...register("is_featured")}
              className="checkbox checkbox-primary checkbox-lg"
            />
            <span className="label-text text-lg font-medium">
              ফিচার্ড নিউজ (হোম পেজে লিড হিসেবে দেখাবে)
            </span>
          </label>
        </div>

        {/* সাবমিট বাটন */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg w-full md:w-auto px-16"
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

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default AddNews;