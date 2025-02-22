import mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  deliveryCharge: { type: Number, default: 0 },
  paymentMethod: { type: String },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    adjustedPrice: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
