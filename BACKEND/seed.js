import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import User from "./models/User.js";
import Channel from "./models/Channels.js";
import Video from "./models/Video.js";

import sampleUsers from "./utils/sampleUsers.js";
import sampleChannels from "./utils/sampleChannels.js";
import sampleVideos from "./utils/sampleVideos.js";

dotenv.config({ path: path.resolve("./config/.env") });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/youtube_clone"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Wipe collections
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();

    // Insert users
    const users = await User.insertMany(sampleUsers);

    // Insert channels linked to users
    const channelsWithUsers = sampleChannels.map((channel, idx) => ({
      ...channel,
      userId: users[idx]._id,
    }));
    const channels = await Channel.insertMany(channelsWithUsers);

    // Insert videos linked to channels
    const videosWithChannels = sampleVideos.map((video, idx) => ({
      ...video,
      channel: channels[idx % channels.length]._id,
      channelId: channels[idx % channels.length]._id,
    }));
    await Video.insertMany(videosWithChannels);

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    console.log("🗑️ Database destroyed!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("👉 To import data, run: node seed.js -i");
  console.log("👉 To delete data, run: node seed.js -d");
}
