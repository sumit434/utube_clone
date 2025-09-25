import mongoose from "mongoose";
import User from "./models/User.js";
import Video from "./models/Video.js";
import Channel from "./models/Channel.js"; // fixed import: Channel.js, not Channels.js

import sampleUsers from "./utils/sampleUsers.js";
import sampleChannels from "./utils/sampleChannels.js";
import sampleVideos from "./utils/sampleVideos.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/youtube_clone"; // change DB name if needed

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedDB = async () => {
  try {
    // Clear old data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});

    // Insert users individually to trigger pre-save hook (hash passwords)
    const users = [];
    for (const u of sampleUsers) {
      const user = new User(u);
      await user.save(); // pre-save hook runs here
      users.push(user);
    }

    // Insert channels, link each to a user
    const channelsWithUser = sampleChannels.map((channel, idx) => {
      return { ...channel, userId: users[idx]._id };
    });
    const channels = await Channel.insertMany(channelsWithUser);

    // Insert videos, link each to a channel
    const videosWithChannel = sampleVideos.map((video, idx) => {
      return { ...video, channel: channels[idx]._id, channelId: channels[idx]._id };
    });
    await Video.insertMany(videosWithChannel);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
