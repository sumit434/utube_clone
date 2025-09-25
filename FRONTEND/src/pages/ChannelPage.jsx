import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios.js";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChannelPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const generateAvatar = (username) =>
    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
      username
    )}`;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchChannelData() {
      try {
        const channelIdToFetch = id || user?.channelId;
        const channelRes = await api.get(`/channels/${channelIdToFetch}`, {
          signal: controller.signal,
        });
        
        if (!mounted) return;
        const channelData = channelRes.data?.data || channelRes.data || null;
        setChannel(channelData);

        let videosRes;
        try {
          videosRes = await api.get(`/videos/${channelIdToFetch}/videos`, {
            signal: controller.signal,
          });
        } catch (err) {
          if (err.response?.status === 404) {
            videosRes = { data: { data: [] } };
          } else if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
            return;
          } else {
            throw err;
          }
        }

        const videosData = videosRes?.data?.data || [];
        setVideos(Array.isArray(videosData) ? videosData : []);
      } catch (err) {
        if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
          console.error("Failed to fetch channel data:", err);
        }
        setChannel(null);
        setVideos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchChannelData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, user]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  if (!channel)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Channel not found</h1>
      </div>
    );

  const isLoggedUserChannel = user?.channelId === channel._id;

  const bannerFallbackUrl = channel
    ? `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
        isLoggedUserChannel ? user.username || user.name : channel.channelName
      )}&backgroundType=solid&chars=0`
    : "";

  return (
    <div className="container mx-auto p-4">
      {/* Banner */}
      <div className="h-28 md:h-32 w-full mb-4 rounded-lg overflow-hidden">
        {channel.bannerUrl ? (
          <img
            src={channel.bannerUrl}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full rounded-lg opacity-35"
            style={{
              backgroundImage: `url("${bannerFallbackUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      {/* Channel Card */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-6 mb-6 shadow-md">
        {/* Avatar */}
        <div className="relative">
          <button className="flex items-center gap-1">
            <img
              src={
                isLoggedUserChannel
                  ? user?.avatar
                  : channel.photoUrl || generateAvatar(channel.channelName)
              }
              alt={channel.channelName}
              className="w-10.5 h-10.5 rounded-full"
            />
          </button>
        </div>

        {/* Channel Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">
            {channel.channelName}
          </h1>
          <p className="text-gray-600 mt-1">{channel.description}</p>
          <span className="text-gray-400 text-sm">
            {channel.subscribersCount || 0} Subscribers • {videos.length} Videos
          </span>
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No videos uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
