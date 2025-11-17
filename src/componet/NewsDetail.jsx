import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import axios from "../hooks/axiosInstance";

export default function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState(null)

  useEffect(() => {
    if (!id) return
    axios
      .get(`/news/${id}/`)
      .then((res) => {
        console.log(res.data)
        setNews(res.data)
      })
      .catch((err) => console.error(err))
  }, [id])

  if (!news) return <p className="text-center mt-10">লোড হচ্ছে...</p>

  // image array থেকে প্রথম ছবিটি নেওয়া
  const imageUrl =
    Array.isArray(news.image) && news.image.length > 0
      ? news.image[0].image
      : null

  return (
    <div className="max-w-4xl mx-auto p-5">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={news.title}
          className="w-full h-96 object-cover rounded"
        />
      )}
      <h1 className="text-3xl font-bold mt-4">{news.title}</h1>
      <p className="text-gray-500 mt-2">
        {new Date(news.created_at).toLocaleString('bn-BD')}
      </p>
      <div className="mt-4 prose max-w-none whitespace-pre-line leading-relaxed">
        {news.content || news.description}
      </div>
    </div>
  )
}
