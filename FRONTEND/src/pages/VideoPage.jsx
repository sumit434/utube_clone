import React, { useState, useEffect } from "react";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
} from "react-icons/ai";
import { useParams } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";
import CommentsSection from "../pages/CommentsSection.jsx"; 
import api from "../utils/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function VideoPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(null);

  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    const fetchVideoAndRelated = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/videos/${id}`);
        const videoData = res.data?.data;
        setCurrentVideo(videoData || null);

        if (videoData) {
          try {
            const countsRes = await api.get(
              `/likes_dislikes/${videoData._id}/counts`
            );
            setLikesCount(countsRes.data?.data?.likes || 0);
            setDislikesCount(countsRes.data?.data?.dislikes || 0);
          } catch (err) {
            console.warn("Failed to fetch reaction counts:", err);
          }
          if (user) {
            try {
              const userReactionRes = await api.get(
                `/likes_dislikes/${videoData._id}`
              );
              setUserReaction(userReactionRes.data?.data || null);
            } catch (err) {
              console.warn("Failed to fetch user reaction:", err);
            }
          }
          if (videoData.channelId) {
            const relatedRes = await api.get(
              `/videos/${videoData.channelId}/videos`
            );
            const filteredRelated = (relatedRes.data?.data || []).filter(
              (v) => v._id !== videoData._id
            );
            setRelatedVideos(filteredRelated);
          }

          setSubscriberCount(videoData.channel?.subscribers || null);
        }
      } catch (err) {
        console.error("Error fetching video or related:", err);
        setCurrentVideo(null);
        setRelatedVideos([]);
        setSubscriberCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAndRelated();
  }, [id, user]);

  const handleReaction = async (type) => {
    if (!user) {
      alert("Please log in to react to videos.");
      return;
    }

    try {
      await api.post(`/likes_dislikes/${currentVideo._id}`, { type });
      const countsRes = await api.get(
        `/likes_dislikes/${currentVideo._id}/counts`
      );
      setLikesCount(countsRes.data?.data?.likes || 0);
      setDislikesCount(countsRes.data?.data?.dislikes || 0);
      const userReactionRes = await api.get(
        `/likes_dislikes/${currentVideo._id}`
      );
      setUserReaction(userReactionRes.data?.data || null);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading video...</div>;
  if (!currentVideo) return <p className="p-4 text-red-500">Video not found.</p>;

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      {/* Main Video */}
      <div className="flex-1">
        <div className="relative pt-[56.25%]">
          <video
            controls
            className="absolute top-0 left-0 w-full h-full"
            src={currentVideo.url}
            poster={currentVideo.thumbnail}
            title={currentVideo.title}
          ></video>
        </div>
        <div className="mt-4">
          <h1 className="text-lg sm:text-xl font-bold">{currentVideo.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentVideo.views?.toLocaleString() || 0} views
          </p>
        </div>

        {/* Channel Info and Description */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-sm text-white">
                {currentVideo.channel?.channelName?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <div>
                <p className="font-semibold text-base">
                  {currentVideo.channel?.channelName || "Unknown Channel"}
                </p>
                <p className="text-sm text-gray-500">
                  {(subscriberCount || 0).toLocaleString()} subscribers
                </p>
              </div>
              <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Like/Dislike Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleReaction("like")}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title="Like"
                >
                  {userReaction === "like" ? (
                    <AiFillLike className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AiOutlineLike className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm text-gray-600">{likesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleReaction("dislike")}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title="Dislike"
                >
                  {userReaction === "dislike" ? (
                    <AiFillDislike className="w-5 h-5 text-gray-600" />
                  ) : (
                    <AiOutlineDislike className="w-5 h-5" />
                  )}
                </button>
                <span className="text-sm text-gray-600">{dislikesCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <p>{currentVideo.description}</p>
          </div>
        </div>

        {/* CommentsSection */}
        <CommentsSection />
      </div>

      {/* Related Videos */}
      <div className="w-full lg:w-80">
        <h2 className="text-lg font-bold mb-3">Related Videos</h2>
        <div className="flex flex-col gap-4">
          {relatedVideos.length > 0 ? (
            relatedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No related videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
}