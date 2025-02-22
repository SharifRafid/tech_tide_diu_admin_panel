"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Define Product Type (for reference in Orders)
interface Product {
  _id: string;
  name: string;
  price: number;
}

// Define Order Product Type
interface OrderProduct {
  product: string;
  quantity: number;
  adjustedPrice?: number;
}

// Define Order Type
interface Order {
  _id: string;
  title: string;
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  deliveryCharge: number;
  paymentMethod?: string;
  products: OrderProduct[];
  totalAmount: number;
  totalProfit: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    deliveryCharge: "",
    paymentMethod: "",
    products: [{ product: "", quantity: "", adjustedPrice: "" }],
    totalAmount: "",
    totalProfit: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get<Order[]>("/api/orders");
    setOrders(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get<Product[]>("/api/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        deliveryCharge: formData.deliveryCharge ? Number(formData.deliveryCharge) : 0,
        products: formData.products.map((p) => ({
          product: p.product,
          quantity: Number(p.quantity),
          adjustedPrice: p.adjustedPrice ? Number(p.adjustedPrice) : undefined,
        })),
        totalAmount: Number(formData.totalAmount),
        totalProfit: Number(formData.totalProfit),
      };
      if (isEditing && editId) {
        await axios.put(`/api/orders/${editId}`, data);
      } else {
        await axios.post("/api/orders", data);
      }
      fetchOrders();
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(`/api/orders/${id}`);
      fetchOrders();
    }
  };

  const handleEdit = (order: Order) => {
    setIsEditing(true);
    setEditId(order._id);
    setFormData({
      title: order.title,
      customerName: order.customerName,
      email: order.email || "",
      phone: order.phone,
      address: order.address,
      deliveryCharge: order.deliveryCharge.toString(),
      paymentMethod: order.paymentMethod || "",
      products: order.products.map((p) => ({
        product: p.product,
        quantity: p.quantity.toString(),
        adjustedPrice: p.adjustedPrice?.toString() || "",
      })),
      totalAmount: order.totalAmount.toString(),
      totalProfit: order.totalProfit.toString(),
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: "", customerName: "", email: "", phone: "", address: "", deliveryCharge: "", paymentMethod: "", products: [{ product: "", quantity: "", adjustedPrice: "" }], totalAmount: "", totalProfit: "" });
  };

  const addProductField = () => setFormData({ ...formData, products: [...formData.products, { product: "", quantity: "", adjustedPrice: "" }] });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Orders</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
          <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white col-span-2" required />
          <input type="number" placeholder="Delivery Charge" value={formData.deliveryCharge} onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
          <input type="text" placeholder="Payment Method" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />

          {/* Dynamic Product Fields */}
          <div className="col-span-2">
            {formData.products.map((prod, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <select value={prod.product} onChange={(e) => {
                  const newProducts = [...formData.products];
                  newProducts[index].product = e.target.value;
                  setFormData({ ...formData, products: newProducts });
                }} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required>
                  <option value="">Select Product</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <input type="number" placeholder="Quantity" value={prod.quantity} onChange={(e) => {
                  const newProducts = [...formData.products];
                  newProducts[index].quantity = e.target.value;
                  setFormData({ ...formData, products: newProducts });
                }} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                <input type="number" placeholder="Adjusted Price" value={prod.adjustedPrice} onChange={(e) => {
                  const newProducts = [...formData.products];
                  newProducts[index].adjustedPrice = e.target.value;
                  setFormData({ ...formData, products: newProducts });
                }} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" />
              </div>
            ))}
            <button type="button" onClick={addProductField} className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Add Product</button>
          </div>

          <input type="number" placeholder="Total Amount" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <input type="number" placeholder="Total Profit" value={formData.totalProfit} onChange={(e) => setFormData({ ...formData, totalProfit: e.target.value })} className="p-3 bg-gray-700 border border-gray-600 rounded-md text-white" required />
          <button type="submit" disabled={loading} className="col-span-2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{loading ? "Saving..." : isEditing ? "Update" : "Add Order"}</button>
        </form>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
              <div>
                <h2 className="text-white font-semibold">{order.title}</h2>
                <p className="text-gray-400">Customer: {order.customerName} | Total: ${order.totalAmount}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(order)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(order._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}