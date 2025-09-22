import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import LikeDislike from "../models/Likes_dislikes.js";
import Video from "../models/Video.js";

// @desc    Create or update reaction (like/dislike)
// @route   POST /api/v1/likes_dislikes/:videoId
// @access  Private
export const reactToVideo = asyncHandler(async (req, res, next) => {
  const { type } = req.body; 
  const videoId = req.params.videoId;
  const userId = req.user._id;

  if (!["like", "dislike"].includes(type)) {
    return next(new ErrorResponse("Type must be 'like' or 'dislike'", 400));
  }
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new ErrorResponse(`No video with id of ${videoId}`, 404));
  }
  let reaction = await LikeDislike.findOne({ videoId, userId });

  if (!reaction) {
    reaction = await LikeDislike.create({ type, videoId, userId });
    return res.status(200).json({ success: true, data: reaction });
  }

  if (reaction.type === type) {
    await LikeDislike.findByIdAndDelete(reaction._id);
    return res.status(200).json({ success: true, data: {} });
  }
  reaction.type = type;
  await reaction.save();
  res.status(200).json({ success: true, data: reaction });
});

// @desc    Get reaction for a video by user
// @route   GET /api/v1/likes_dislikes/:videoId
// @access  Private
export const getReaction = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.user._id;

  const reaction = await LikeDislike.findOne({ videoId, userId });

  res.status(200).json({
    success: true,
    data: reaction ? reaction.type : null,
  });
});

// @desc    Get like & dislike counts for a video
// @route   GET /api/v1/likes_dislikes/:videoId/counts
// @access  Public (anyone can see counts)
export const getReactionCounts = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;
  const likes = await LikeDislike.countDocuments({ videoId, type: "like" });
  const dislikes = await LikeDislike.countDocuments({ videoId, type: "dislike" });

  res.status(200).json({
    success: true,
    data: {
      likes,
      dislikes,
    },
  });
});