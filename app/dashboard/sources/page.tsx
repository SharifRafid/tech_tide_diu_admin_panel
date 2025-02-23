"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { createPortal } from "react-dom"; // Import createPortal

interface Source {
  _id: string;
  name: string;
  description?: string;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [formData, setFormData] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setError(null);
      const res = await axios.get<Source[]>("/api/sources");
      setSources(res.data);
    } catch (err) {
      setError("Failed to fetch sources. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing && editId) {
        await axios.put("/api/sources", { id: editId, data: formData });
      } else {
        await axios.post("/api/sources", formData);
      }
      fetchSources();
      resetForm();
      setOpen(false);
    } catch (err) {
      setError("An error occurred while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this source?")) {
      try {
        await axios.delete(`/api/sources?id=${id}`);
        fetchSources();
      } catch (err) {
        setError("Failed to delete. Please try again.");
      }
    }
  };

  const handleEdit = (source: Source) => {
    setIsEditing(true);
    setEditId(source._id);
    setFormData({ name: source.name, description: source.description || "" });
    setOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: "", description: "" });
  };

  // Extracted Popup Component
  const SourceFormPopup = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-indigo-100 mb-6">
          {isEditing ? "Edit Source" : "Add New Source"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-200 mb-1">Name</label>
            <input
              type="text"
              placeholder="Source Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-indigo-200 mb-1">Description</label>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-indigo-100 tracking-tight">
            Sources Management
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
          >
            + Add Source
          </button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-200 bg-red-900/80 p-3 rounded-lg mb-6"
          >
            {error}
          </motion.p>
        )}

        {/* Sources List */}
        <div className="grid gap-6">
          {sources.map((source) => (
            <motion.div
              key={source._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-200">{source.name}</h2>
                  <p className="text-gray-300">{source.description || "No description provided"}</p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(source)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(source._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Use Portal to render the popup at the root level */}
        {open && createPortal(
          <AnimatePresence>
            <SourceFormPopup />
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  );
}