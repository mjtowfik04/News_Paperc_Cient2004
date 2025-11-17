import { useNavigate } from "react-router";

export default function NewsCard({ news }) {
  const navigate = useNavigate();
  const imageUrl =
    Array.isArray(news.image) && news.image.length > 0
      ? news.image[0].image
      : null;

  return (
    <div
      onClick={() => navigate(`/news/${news.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={news.title}
          className="w-full h-48 sm:h-56 object-cover"
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          {news.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-4">
          {news.description || news.content?.slice(0, 100) + "..."}
        </p>
      </div>
    </div>
  );
}
