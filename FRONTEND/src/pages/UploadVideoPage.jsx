import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../utils/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export function UploadVideoPage (){

  const { user } = useAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
 
    videoFile: { url: "" },
    thumbnail: { url: "" },
    category: "All",
  });

  const categories = [
    "All",
    "Gaming",
    "Music",
    "Education",
    "Entertainment",
    "News",
    "Sports",
  ];

  useEffect(() => {
    if (!user?.channelId) {
      navigate("/channel/create");
    }
  }, [user, navigate]);

  const handleChange = (e) =>{
    const { name, value } = e.target;
    
    if (name === "videoUrl") {
      setForm({ ...form, videoFile: { url: value } });
    } else if (name === "thumbnailUrl") {
      setForm({ ...form, thumbnail: { url: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setAlertMessage("");
  try {

    const payload = {
      title: form.title,
      description: form.description,
      url: form.videoFile.url, 
      thumbnail: form.thumbnail.url, 
      category: form.category,
      channelId: user.channelId,
    };

    await api.post("/videos", payload);

    navigate(`/channel/${user.channelId}`);
    } catch (err) {
     console.error("Upload error:", err);
      setAlertMessage(err.response?.data?.message || "Error uploading video");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Video Title"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Video Description"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
        
            name="videoUrl"
            value={form.videoFile.url}
            onChange={handleChange}
            placeholder="Video URL"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
        
            name="thumbnailUrl"
            value={form.thumbnail.url}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Upload
          </button>
        </form>
        {alertMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
}