"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { createPortal } from "react-dom"; // Import createPortal

// Types remain unchanged
interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderProduct {
  product: string;
  quantity: number;
  adjustedPrice?: number;
  total?: number;
}

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    deliveryCharge: "",
    paymentMethod: "",
    products: [{ product: "", quantity: "1", adjustedPrice: "", total: "0" }],
    totalAmount: "0",
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

  const calculateTotals = (updatedProducts: typeof formData.products) => {
    const totalAmount = updatedProducts.reduce((sum, prod) => {
      const product = products.find((p) => p._id === prod.product);
      const price = Number(prod.adjustedPrice) || (product?.price || 0);
      return sum + price * Number(prod.quantity);
    }, 0);
    return { ...formData, products: updatedProducts, totalAmount: totalAmount.toString() };
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };

    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        newProducts[index].adjustedPrice = selectedProduct.price.toString();
      }
    }

    setFormData(calculateTotals(newProducts));
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
        await axios.put(`/api/orders`, { id: editId, data });
      } else {
        await axios.post("/api/orders", data);
      }
      fetchOrders();
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(`/api/orders?id=${id}`);
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
        total: "0",
      })),
      totalAmount: order.totalAmount.toString(),
      totalProfit: order.totalProfit.toString(),
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      title: "",
      customerName: "",
      email: "",
      phone: "",
      address: "",
      deliveryCharge: "",
      paymentMethod: "",
      products: [{ product: "", quantity: "1", adjustedPrice: "", total: "0" }],
      totalAmount: "0",
      totalProfit: "",
    });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: "", quantity: "1", adjustedPrice: "", total: "0" }],
    });
  };

  // Popup component extracted for clarity
  const OrderFormPopup = () => (
    <motion.div
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        // initial={{ scale: 0.9, opacity: 0 }}
        // animate={{ scale: 1, opacity: 1 }}
        // exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? "Edit Order" : "Add New Order"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="number"
              placeholder="Delivery Charge"
              value={formData.deliveryCharge}
              onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Products</h3>
            {formData.products.map((prod, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <select
                  value={prod.product}
                  onChange={(e) => handleProductChange(index, "product", e.target.value)}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={prod.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={prod.adjustedPrice}
                  onChange={(e) => handleProductChange(index, "adjustedPrice", e.target.value)}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={
                    prod.adjustedPrice && prod.quantity
                      ? (Number(prod.adjustedPrice) * Number(prod.quantity)).toFixed(2)
                      : "0.00"
                  }
                  disabled
                  className="p-3 bg-gray-600 border border-gray-600 rounded-lg text-white"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addProductField}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Product
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">
                Total Amount: <span className="font-bold">${Number(formData.totalAmount).toFixed(2)}</span>
              </p>
              <input
                type="number"
                placeholder="Total Profit"
                value={formData.totalProfit}
                onChange={(e) => setFormData({ ...formData, totalProfit: e.target.value })}
                className="mt-2 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                required
              />
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Orders Management</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Order
          </button>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">{order.title}</h2>
                  <p className="text-gray-300">Customer: {order.customerName}</p>
                  <p className="text-gray-300">Total: ${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(order)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Use Portal to render the popup at the root level */}
        {isFormOpen && createPortal(
          <AnimatePresence>
            <OrderFormPopup />
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  );
}