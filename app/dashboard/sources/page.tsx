"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

// Define Source Type
interface Source {
  _id: string;
  name: string;
  description?: string;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
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
        await axios.put(`/api/sources`, {id: editId, data: formData});
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
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/sources?id=${id}`,);
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Sources</h1>

        {error && <p className="text-red-500 bg-red-800 p-2 rounded-md mb-4">{error}</p>}

        {/* Add Button */}
        <button onClick={() => setOpen(true)} className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Source
        </button>

        {/* Sources List */}
        <div className="space-y-4 mt-6">
          {sources.map((source) => (
            <motion.div key={source._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
              <div>
                <h2 className="text-white font-semibold">{source.name}</h2>
                <p className="text-gray-400">{source.description}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(source)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(source._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditing ? "Edit Source" : "Add Source"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-3 bg-gray-200 border border-gray-300 rounded-md" required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="p-3 bg-gray-200 border border-gray-300 rounded-md" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
