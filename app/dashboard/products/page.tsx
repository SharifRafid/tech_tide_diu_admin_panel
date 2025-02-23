"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSources();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get<Product[]>("/api/products");
    setProducts(res.data);
  };

  const fetchSources = async () => {
    const res = await axios.get<Source[]>("/api/sources");
    setSources(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        buyingPrice: Number(formData.buyingPrice),
      };
      if (isEditing && editId) {
        await axios.put(`/api/products`, { id: editId, data: data });
      } else {
        await axios.post("/api/products", data);
      }
      fetchProducts();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(`/api/products?id=${id}`);
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
    setDialogOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      price: "",
      discountPrice: "",
      buyingPrice: "",
      source: "",
      image: "",
      description: "",
      shortDescription: "",
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="bg-gray-900 p-4 h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-2xl h-full flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Products</h1>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              background: 'linear-gradient(45deg, #9333ea, #ec4899)',
              '&:hover': { 
                background: 'linear-gradient(45deg, #7e22ce, #db2777)',
              },
            }}
          >
            Add Product
          </Button>
        </div>

        {/* Products List */}
        <div className="space-y-4 flex-grow overflow-auto">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center bg-gray-700 p-4 rounded-md"
            >
              <div>
                <h2 className="text-white font-semibold">{product.name}</h2>
                <p className="text-gray-400">
                  Price: ${product.price} | Source: {product.source?.name ?? ""}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleEdit(product)}
                  size="small"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(product._id)}
                  size="small"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dialog Form */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { 
              bgcolor: '#1f2937', 
              color: 'white', 
              borderRadius: 2,
              width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
              maxWidth: '900px',
              m: 'auto'
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#374151', py: 2 }}>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent 
              sx={{ 
                py: 3,
                px: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr',
                  },
                }}
              >
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  variant="outlined"
                  fullWidth
                  sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  variant="outlined"
                  fullWidth
                  sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <TextField
                  label="Discount Price"
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <TextField
                  label="Buying Price"
                  type="number"
                  value={formData.buyingPrice}
                  onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                  required
                  variant="outlined"
                  fullWidth
                  sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'gray' }}>Source</InputLabel>
                  <Select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="">Select Source</MenuItem>
                    {sources.map((source) => (
                      <MenuItem key={source._id} value={source._id}>
                        {source.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                />
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    textarea: { color: 'white' }, 
                    label: { color: 'gray' },
                    gridColumn: { xs: 'span 1', sm: 'span 2' },
                  }}
                />
                <TextField
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    textarea: { color: 'white' }, 
                    label: { color: 'gray' },
                    gridColumn: { xs: 'span 1', sm: 'span 2' },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 2, md: 3 } }}>
              <Button 
                onClick={handleCloseDialog} 
                color="inherit"
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #9333ea, #ec4899)',
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #7e22ce, #db2777)',
                  },
                  px: 3,
                }}
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </motion.div>
    </div>
  );
}