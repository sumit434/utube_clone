import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Please add a channel name"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one channel per user
    },
    photoUrl: {
      type: String,
      default: "default-channel.png", // fallback channel photo
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    subscribersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Optional: text index for search
ChannelSchema.index({ name: "text", description: "text" });

export default mongoose.model("Channel", ChannelSchema);
