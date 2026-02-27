import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import authApiClient from "../hooks/axiosInstance";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewsDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
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
      .catch(() => {
        toast.error("নিউজ লোড করতে সমস্যা হয়েছে");
        setLoading(false);
      });
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await authApiClient.get(`/news/${id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (news) fetchComments();
  }, [news]);

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
    } catch {
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
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-2xl text-black">নিউজ পাওয়া যায়নি!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 md:p-12 text-black">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          {news.title}
        </h1>

        <p className="mb-8 text-lg">
          প্রকাশিত: {formatDate(news.created_at)}
        </p>

        {news.image && news.image.length > 0 && (
          <div className="mb-10">
            <img
              src={news.image[0].image}
              alt={news.title}
              className="w-full h-96 md:h-[500px] object-cover rounded-xl"
            />
          </div>
        )}

        <div className="leading-relaxed whitespace-pre-line text-justify mb-12 text-lg">
          {news.content}
        </div>

        {/* Comment Section */}
        <section className="border-t pt-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            কমেন্ট ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-10">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                isAuthenticated
                  ? "আপনার মতামত লিখুন..."
                  : "কমেন্ট করতে লগইন করুন"
              }
              className="textarea textarea-bordered textarea-lg w-full resize-none"
              rows="5"
              disabled={!isAuthenticated || commentLoading}
            ></textarea>

            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={!isAuthenticated || commentLoading}
                className="btn btn-primary btn-lg"
              >
                {commentLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "কমেন্ট করুন"
                )}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {(showAllComments ? comments : comments.slice(0, 3)).map(
              (comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-6 rounded-xl shadow"
                >
                  <p className="font-bold">
                    {comment.user?.username || "অজ্ঞাত ইউজার"}
                  </p>
                  <p className="text-sm mb-2">
                    {formatDate(comment.created_at)}
                  </p>
                  <p>{comment.content}</p>
                </div>
              )
            )}
          </div>

          {!showAllComments && comments.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllComments(true)}
                className="btn btn-outline border-black text-black"
              >
                সব দেখুন
              </button>
            </div>
          )}
        </section>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}