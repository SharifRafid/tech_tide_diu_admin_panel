"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Define Product Type
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  buyingPrice: number;
  source: { _id: string; name: string };
  image?: string;
  description?: string;
  shortDescription?: string;
}

// Define Source Type
interface Source {
  _id: string;
  name: string;
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    buyingPrice: "",
    source: "",
    image: "",
    description: "",
    shortDescription: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSources();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get<Product[]>("/api/products");
    console.log(res.data);
    setProducts(res.data);
  };

  const fetchSources = async () => {
    const res = await axios.get<Source[]>("/api/sources");
    console.log(res.data);
    setSources(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, price: Number(formData.price), discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined, buyingPrice: Number(formData.buyingPrice) };
      if (isEditing && editId) {
        await axios.put(`/api/products/${editId}`, data);
      } else {
        await axios.post("/api/products", data);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditId(product._id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || "",
      buyingPrice: product.buyingPrice.toString(),
      source: product.source._id,
      image: product.image || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: "", price: "", discountPrice: "", buyingPrice: "", source: "", image: "", description: "", shortDescription: "" });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Products</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <input type="number" placeholder="Discount Price" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
          <input type="number" placeholder="Buying Price" value={formData.buyingPrice} onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required>
            <option value="">Select Source</option>
            {sources.map((source) => <option key={source._id} value={source._id}>{source.name}</option>)}
          </select>
          <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white col-span-2" />
          <textarea placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white col-span-2" />
          <button type="submit" disabled={loading} className="col-span-2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{loading ? "Saving..." : isEditing ? "Update" : "Add Product"}</button>
        </form>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <motion.div key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
              <div>
                <h2 className="text-white font-semibold">{product.name}</h2>
                <p className="text-gray-400">Price: ${product.price} | Source: {product.source?.name ?? ""}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}