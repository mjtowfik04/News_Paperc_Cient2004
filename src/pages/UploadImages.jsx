import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadImages = () => {
  const { newsId } = useParams();  // URL থেকে newsId নেওয়া
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image!");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);  // multiple images
    }

    try {
      // ধরে নিচ্ছি আপনার ব্যাকএন্ডে nested router আছে: /news/{id}/images/
      await authApiClient.post(`news/${newsId}/images/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Images uploaded successfully!");
      navigate("/news-list");  // অথবা যেখানে চান
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to upload images!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Upload Images for News ID: {newsId}</h2>

      <div className="space-y-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn btn-success w-full"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UploadImages;