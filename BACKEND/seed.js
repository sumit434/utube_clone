import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js'; // Adjust the path to your Video model

dotenv.config({ path: './.env' });

// Function to connect to the database (you'll need to define this)
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

// ✅ FIX: Added a valid `_id` for the video and ensured a valid `channelId`
const sampleVideos = [
    {
        "_id": "68c1b0ab2d163fcf488fc91b", // This is the ID from your URL. We are ensuring it exists in the database.
        "videoId": "video01",
        "title": "Learn React in 30 Minutes",
        "thumbnailUrl": "https://placehold.co/400x225/E53E3E/FFFFFF?text=React", 
        "description": "A quick tutorial to get started with React.",
        "channel": "68c0179f12853cbacbc576cf", // Ensure this is a valid Channel ID
        "uploader": "user01",
        "views": 15200,
        "likes": 1023,
        "dislikes": 45,
        "uploadDate": "2024-09-20",
        "comments": [
            {
                "commentId": "comment01",
                "userId": "user02",
                "text": "Great video! Very helpful.",
                "timestamp": "2024-09-21T08:30:00Z"
            }
        ]
    }
];

const importData = async () => {
    try {
        await connectDB();
        await Video.deleteMany();
        await Video.insertMany(sampleVideos);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await connectDB();
        await Video.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log("To import data, run 'node seed.js -i'");
    console.log("To delete data, run 'node seed.js -d'");
}
