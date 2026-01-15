import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadImages = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("অনুগ্রহ করে অন্তত একটি ছবি নির্বাচন করুন!");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    // Key: "image" (singular) – তোমার serializer-এ 'image' ফিল্ড
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    try {
      // কোনো headers দিও না – interceptor ঠিকমতো হ্যান্ডেল করবে
      await authApiClient.post(`/news/${newsId}/images/`, formData);

      toast.success("ছবি সফলভাবে আপলোড হয়েছে!");
      
      // ← এখানে /dashboard এ রিডাইরেক্ট
      navigate("/dashboard");
    } catch (error) {
      console.log("Upload error:", error.response?.data || error);
      toast.error("ছবি আপলোড করতে সমস্যা হয়েছে!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        নিউজ আইডি #{newsId} এর জন্য ছবি আপলোড করুন
      </h2>

      <div className="space-y-6">
        <div className="form-control">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full"
          />
          <label className="label">
            <span className="label-text-alt text-gray-600">
              একাধিক ছবি নির্বাচন করতে পারবেন
            </span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn btn-success w-full text-lg"
        >
          {uploading ? (
            <>
              <span className="loading loading-spinner"></span>
              আপলোড হচ্ছে...
            </>
          ) : (
            "ছবি আপলোড করুন"
          )}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UploadImages;