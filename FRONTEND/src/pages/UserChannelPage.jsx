import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/axios.js";

export default function UserChannelPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({ channelName: "", description: "" });
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/channels", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const channel = response.data.channel;
      if (channel && updateUser) {
        updateUser({ channelId: channel._id }); 
      }

      navigate("/"); 
    } catch (error) {
      console.error(error);
      setAlertMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Channel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="channelName"
            placeholder="Channel Name"
            value={form.channelName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Channel Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Create Channel
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
