import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a video title'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  url: {
    type: String,
    required: [true, 'Please provide a video URL'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail URL'],
  },
  channelId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
  },
  views: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'Other',
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
    channel: {
    type: mongoose.Schema.ObjectId,
    ref: "Channel",
    required: true,
  }
});

export default mongoose.model('Video', VideoSchema);