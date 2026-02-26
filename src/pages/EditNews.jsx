// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import authApiClient from "../hooks/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditNews = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // 🔹 Load categories and news together
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [catRes, newsRes] = await Promise.all([
//         authApiClient.get("/categories/"),
//         authApiClient.get(`/news/${id}/`),
//       ]);

//       setCategories(catRes.data || []);
//       setTitle(newsRes.data.title);
//       setContent(newsRes.data.content);
//       setCategory(newsRes.data.category?.id || "");
//     } catch (error) {
//       toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [id]);

//   // 🔹 Update news
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       await authApiClient.patch(`/news/${id}/`, {
//         title,
//         content,
//         category,
//       });

//       toast.success("নিউজ সফলভাবে আপডেট হয়েছে");

//       setTimeout(() => {
//         navigate("/all-news-manage");
//       }, 1200);
//     } catch {
//       toast.error("নিউজ আপডেট করতে সমস্যা হয়েছে");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <p className="text-center py-20">লোড হচ্ছে...</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">নিউজ এডিট করুন</h2>

//       <form onSubmit={handleUpdate} className="space-y-4">
//         <input
//           className="input input-bordered w-full"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="নিউজ টাইটেল"
//           required
//           disabled={saving}
//         />

//         <textarea
//           className="textarea textarea-bordered w-full h-40"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="নিউজ কনটেন্ট"
//           required
//           disabled={saving}
//         />

//         <select
//           className="select select-bordered w-full"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//           disabled={saving}
//         >
//           <option value="">ক্যাটাগরি সিলেক্ট করুন</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           disabled={saving}
//           className="btn btn-primary w-full"
//         >
//           {saving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
//         </button>
//       </form>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default EditNews;