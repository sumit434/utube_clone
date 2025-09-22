import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/axios";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (query) {
          res = await api.get(`/search/videos?text=${query}`);
        } else {
          res = await api.get("/videos");
        }
        setVideos(res.data.data || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video._id} video={video} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">No videos found</p>
      )}
    </div>
  );
}
