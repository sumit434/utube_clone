import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import Video from "../models/Video.js";
import Channel from "../models/Channels.js"

// @desc      Get all videos
// @route     GET /api/v1/videos
// @access    Public
export const getVideos = asyncHandler(async (req, res, next) => {
res.set('Cache-Control', 'no-store');

  const videos = await Video.find().populate('channel', 'channelName photoUrl');
  console.log("Fetched videos:", videos);

  if (!videos || videos.length === 0) {
    return next(new ErrorResponse("No videos found", 404));
  }
  res.status(200).json({ success: true, count: videos.length, data: videos });
});

// @desc      Get single video
// @route     GET /api/v1/videos/:id
// @access    Public
export const getVideoById = asyncHandler(async (req, res, next) => {

  const video = await Video.findById(req.params.id).populate('channel', 'channelName photoUrl');
  console.log("Fetched video:", video);

  if (!video) {
    return next(new ErrorResponse("Video not found", 404));
  }
  res.status(200).json({ success: true, data: video });
});

// @desc      Create new video
// @route     POST /api/v1/videos
// @access    Private
export const uploadVideo = asyncHandler(async (req, res, next) => {

  if (!req.user.channelId) {
    return next(
      new ErrorResponse("Please create a channel before uploading a video", 400)
    );
  }
  req.body.channel = req.user.channelId;
  const video = await Video.create(req.body);
  res.status(201).json({ success: true, data: video });
});

// @desc      Update a video
// @route     PUT /api/v1/videos/:id
// @access    Private
export const updateVideo = asyncHandler(async (req, res, next) => {

   let video = await Video.findById(req.params.id);

   if (!video) {
   return next(new ErrorResponse("Video not found", 404));
   }
  if (video.channel.toString() !== req.user.channelId.toString()) {
    return next(new ErrorResponse("Not authorized to update this video", 401));
   }
   video = await Video.findByIdAndUpdate(req.params.id, req.body, {
     new: true, 
    runValidators: true, 
   });
   res.status(200).json({ success: true, data: video });
});

// @desc      Delete a video
// @route     DELETE /api/v1/videos/:id
// @access    Private
export const deleteVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse("Video not found", 404));
  }
  if (!req.user || !req.user.channelId) {
    return next(new ErrorResponse("Not authorized to delete this video", 401));
  }
  if (video.channel.toString() !== req.user.channelId.toString()) {
    return next(new ErrorResponse("Not authorized to delete this video", 401));
  }

  await video.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Increase view count
// @route     PUT /api/v1/videos/:id/view
// @access    Public
export const OnSearch =asyncHandler (async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }
    const searchPattern = new RegExp(query, 'i');
    const videosByTitle = await Video.find({

      title: { $regex: searchPattern },
    }).populate('channel'); 

    const channels = await Channel.find({
      name: { $regex: searchPattern },
    });
    let videosByChannel = [];
    if (channels.length > 0) {
      const channelIds = channels.map((channel) => channel._id);
      videosByChannel = await Video.find({
        channelId: { $in: channelIds },
      }).populate('channel');
    }
    const allResults = [...videosByTitle, ...videosByChannel];
    const uniqueVideos = Array.from(new Set(allResults.map((v) => v._id.toString()))).map((id) =>
      allResults.find((v) => v._id.toString() === id),
    );

    res.status(200).json(uniqueVideos);
  } catch (err) {
    next(err);
  }
});

// @desc      Get all videos for a specific channel
// @route     GET /api/v1/videos/:channelId/videos
// @access    Public
export const getChannelVideos = asyncHandler(async (req, res, next) => {

  const videos = await Video.find({
    $or: [
      { channel: req.params.channelId },
      { channelId: req.params.channelId },
    ],
  }).populate('channel');

  if (!videos || videos.length === 0) {
    return next(new ErrorResponse(`No videos found for channel with ID ${req.params.channelId}`, 404));
  }
  
  res.status(200).json({
    success: true,
    count: videos.length,
    data: videos,
  });
});

// @desc      Get videos by category
// @route     GET /api/v1/videos/category?category=caategories
// @access    Public
export const getVideosByCategory = asyncHandler(async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category || category === "All") {
      const videos = await Video.find({}).populate("channel");
      return res.status(200).json({ success: true, data: videos });
    }

    const videos = await Video.find({ category: category }).populate("channel");

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No videos found for this category.",
      });
    }
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    next(error);
  }
});