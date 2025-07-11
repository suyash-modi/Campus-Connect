import { useState } from "react";
import api from "../services/api";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(""); // ✅ new

  const postJob = async () => {
    if (!title || !description || !location) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await api.post("/jobs", { title, description, location }); // ✅ include location
      alert("✅ Job posted successfully!");
      setTitle("");
      setDescription("");
      setLocation(""); // ✅ reset location too
    } catch (err) {
      alert("❌ Failed to post job.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-4">Post a New Job</h1>

      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Job Description"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={postJob}
      >
        Post Job
      </button>
    </div>
  );
}
