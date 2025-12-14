import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../hooks/apiClinent";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";  // ← যোগ করুন

const AddNews = () => {
  const navigate = useNavigate();  // ← যোগ করুন

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/categories/");
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to load categories!");
      }
    };
    fetchCategories();
  }, []);

  const handleProductAdd = async (data) => {
    try {
      const formData = {
        title: data.title,
        content: data.content,
        category: Number(data.category),
        is_published: true,
      };

      const productRes = await authApiClient.post("news/", formData);

      const newsId = productRes.data.id;  // ← নতুন নিউজের ID নিন

      toast.success("News added successfully! Now upload images.");
      reset();

      // ← নতুন পেজে রিডাইরেক্ট করুন, newsId পাস করে
      navigate(`/upload-images/${newsId}`);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to add news!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add News</h2>

      <form onSubmit={handleSubmit(handleProductAdd)} className="space-y-4">
        {/* Title, Content, Category – আগের মতোই */}
        <div>
          <label className="block text-sm font-medium">News Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input input-bordered w-full"
            placeholder="Enter title"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className="textarea textarea-bordered w-full h-40"
            placeholder="Write content..."
          ></textarea>
          {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="select select-bordered w-full"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Create News & Upload Images
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddNews;