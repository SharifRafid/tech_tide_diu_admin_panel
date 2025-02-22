import { useState, useEffect } from 'react';

export default function OrderForm() {
  const [order, setOrder] = useState({
    title: '',
    customerName: '',
    email: '',
    phone: '',
    address: '',
    deliveryCharge: 0,
    products: [],
    paymentMethod: ''
  });
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p._id === productId);
    setSelectedProducts([...selectedProducts, {
      product: product._id,
      quantity: 1,
      adjustedPrice: product.price
    }]);
  };

  const calculateTotals = () => {
    const totals = {
      total: 0,
      profit: 0,
      bySource: {}
    };

    selectedProducts.forEach(sp => {
      const product = products.find(p => p._id === sp.product);
      const subtotal = sp.adjustedPrice * sp.quantity;
      const profit = (sp.adjustedPrice - product.buyingPrice) * sp.quantity;
      
      totals.total += subtotal;
      totals.profit += profit;

      if (!totals.bySource[product.source._id]) {
        totals.bySource[product.source._id] = {
          name: product.source.name,
          total: 0,
          profit: 0
        };
      }

      totals.bySource[product.source._id].total += subtotal;
      totals.bySource[product.source._id].profit += profit;
    });

    totals.total += parseFloat(order.deliveryCharge);
    return totals;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    
    const orderData = {
      ...order,
      products: selectedProducts,
      totalAmount: totals.total,
      totalProfit: totals.profit
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      // Handle success (e.g., redirect or show success message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8">
      {/* Customer Information */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Customer Information</h2>
        <input
          type="text"
          value={order.title}
          onChange={(e) => setOrder({ ...order, title: e.target.value })}
          placeholder="Order Title"
          className="w-full mb-4 p-2 border rounded"
        />
        {/* Add other customer fields similarly */}
      </div>

      {/* Product Selection */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Products</h2>
        <select
          onChange={(e) => handleProductSelect(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        {/* Selected Products List */}
        {selectedProducts.map((sp, index) => {
          const product = products.find(p => p._id === sp.product);
          return (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3>{product.name}</h3>
              <input
                type="number"
                value={sp.quantity}
                onChange={(e) => {
                  const newSelected = [...selectedProducts];
                  newSelected[index].quantity = parseInt(e.target.value);
                  setSelectedProducts(newSelected);
                }}
                className="w-24 p-2 border rounded"
                min="1"
              />
              <input
                type="number"
                value={sp.adjustedPrice}
                onChange={(e) => {
                  const newSelected = [...selectedProducts];
                  newSelected[index].adjustedPrice = parseFloat(e.target.value);
                  setSelectedProducts(newSelected);
                }}
                className="w-24 ml-4 p-2 border rounded"
                step="0.01"
              />
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Order Summary</h2>
        {Object.values(calculateTotals().bySource).map(source => (
          <div key={source.name} className="mb-2">
            <h3>{source.name}</h3>
            <p>Total: ${source.total.toFixed(2)}</p>
            <p>Profit: ${source.profit.toFixed(2)}</p>
          </div>
        ))}
        <div className="mt-4 text-xl">
          <p>Total Amount: ${calculateTotals().total.toFixed(2)}</p>
          <p>Total Profit: ${calculateTotals().profit.toFixed(2)}</p>
        </div>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
        Create Order
      </button>
    </form>
  );
}