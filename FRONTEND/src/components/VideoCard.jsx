import { Link } from "react-router-dom";

function VideoCard({ video }) {
  console.log("Data received by VideoCard:", video); 

  const formatViews = (views) => {
    if (!views && views !== 0) return "0 views";
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M views";
    if (views >= 1_000) return (views / 1_000).toFixed(0) + "K views";
    return views + " views";
  };

  const thumbnailUrl =
    typeof video.thumbnail === "string"
      ? video.thumbnail
      : video.thumbnail?.url || "https://via.placeholder.com/300x200";

  return (
    <Link
      to={`/videos/${video._id}`}
      className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <img
        src={thumbnailUrl} 
        alt={video.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500">
          {video.channel?.channelName || "Unknown Channel"}
        </p>
        <p className="text-xs text-gray-500">{formatViews(video.views)}</p>
      </div>
    </Link>
  );
}

export default VideoCard;