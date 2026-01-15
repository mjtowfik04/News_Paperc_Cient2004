import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewsDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    authApiClient
      .get(`/news/${id}/`)
      .then((res) => {
        setNews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("নিউজ লোড করতে সমস্যা হয়েছে");
        setLoading(false);
      });
  }, [id]);

  // কমেন্ট লোড
  const fetchComments = async () => {
    try {
      const res = await authApiClient.get(`/news/${id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error("Comments load error:", err);
    }
  };

  useEffect(() => {
    if (news) fetchComments();
  }, [news]);

  // কমেন্ট পোস্ট
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("কমেন্ট লিখুন!");
      return;
    }
    if (!isAuthenticated) {
      toast.error("কমেন্ট করতে লগইন করুন");
      return;
    }

    setCommentLoading(true);
    try {
      await authApiClient.post(`/news/${id}/comments/`, {
        content: newComment,
      });
      toast.success("কমেন্ট যোগ হয়েছে!");
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error("কমেন্ট করতে সমস্যা হয়েছে");
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-1 pt-1">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-xl">নিউজ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-1 pt-1 text-red-600">
        <p className="text-2xl">নিউজ পাওয়া যায়নি!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-1 my-1 pt-1">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        {news.title}
      </h1>

      <p className="text-gray-600 mb-8 text-lg">
        প্রকাশিত: {formatDate(news.created_at)}
      </p>

      {news.image && news.image.length > 0 ? (
        <>
          <div className="mb-8">
            <img
              src={news.image[0].image}
              alt={news.title}
              className="w-full h-96 md:h-[500px] object-cover rounded-xl shadow-lg"
              onError={(e) => (e.target.src = "https://via.placeholder.com/1200x600?text=No+Image")}
            />
          </div>
          {news.image.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {news.image.slice(1).map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={news.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                  onClick={() => window.open(img.image, "_blank")}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/600x400?text=No+Image")}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 mb-10 flex items-center justify-center">
          <p className="text-gray-500 text-2xl">কোনো ছবি আপলোড করা হয়নি</p>
        </div>
      )}

      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line text-justify mb-12">
        {news.content}
      </div>

  {/* কমেন্ট সেকশন */}
  
        <section className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            কমেন্ট ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-10">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAuthenticated ? "আপনার মতামত লিখুন..." : "কমেন্ট করতে লগইন করুন"}
              className="textarea textarea-bordered textarea-lg w-full resize-none"
              rows="5"
              disabled={!isAuthenticated || commentLoading}
              required
            ></textarea>
            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={commentLoading || !isAuthenticated}
                className="btn btn-primary btn-lg"
              >
                {commentLoading ? <span className="loading loading-spinner"></span> : "কমেন্ট করুন"}
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <p className="text-center text-gray-500 text-xl py-10">
              এখনো কোনো কমেন্ট নেই। আপনি প্রথম কমেন্ট করুন!
            </p>
          ) : (
            <div className="space-y-6">
              {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-14 rounded-full ring ring-primary ring-offset-2">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-primary">
                        {comment.user?.username || "অজ্ঞাত ইউজার"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}

              {!showAllComments && comments.length > 3 && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowAllComments(true)}
                    className="btn btn-outline btn-primary btn-lg"
                  >
                    সব দেখুন ({comments.length - 3}টি আরও)
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}