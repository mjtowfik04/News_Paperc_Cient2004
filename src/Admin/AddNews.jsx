import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../hooks/apiClinent";        // Public API
import authApiClient from "../hooks/axiosInstance"; // Auth API
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNews = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/categories/");
        setCategories(res.data);
      } catch (error) {
        console.log("Error loading categories", error);
        toast.error("Failed to load categories!");
      }
    };

    fetchCategories();
  }, []);

  // Create News
  const handleProductAdd = async (data) => {
    try {
      const formData = {
        title: data.title,
        content: data.content,
        category: Number(data.category),
        is_published: true,
      };

      const productRes = await authApiClient.post("news/", formData);
      console.log("News Added:", productRes.data);

      toast.success("News added successfully!");
      reset();
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to add news!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add News</h2>

      <form onSubmit={handleSubmit(handleProductAdd)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">News Title</label>
          <input
            {...register("title", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs">Title is required</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register("content", { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Write content..."
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-xs">Content is required</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs">Category is required</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Add News
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddNews;
