import asyncHandler from "../middleware/async.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

// @desc    Search for users (channels)
// @route   GET /api/v1/search/users?text=xyz
// @access  Public
export const searchUsers = asyncHandler(async (req, res, next) => {
  const text = req.query.text || ""; 
  let channels = await User.find({
    $or: [
      { channelName: { $regex: text, $options: "i" } },
      { name: { $regex: text, $options: "i" } },
    ],
  });

  res.status(200).json({
    success: true,
    count: channels.length,
    data: channels,
  });
});

// @desc    Search for videos
// @route   GET /api/v1/search/videos?text=xyz
// @access  Public
export const searchVideos = asyncHandler(async (req, res, next) => {
  const text = req.query.text || ""; 

  let videos = await Video.find({
    $or: [
      { title: { $regex: text, $options: "i" } },
      { description: { $regex: text, $options: "i" } },
    ],
  }).populate("channel", "channelName photoUrl");

  res.status(200).json({
    success: true,
    count: videos.length,
    data: videos,
  });
});


