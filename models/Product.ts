import mongoose from 'mongoose';

// Define the Product Schema
export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  buyingPrice: { type: Number, required: true },
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
  image: { type: String },
  description: { type: String },
  shortDescription: { type: String },
}, { timestamps: true });

// Create the Product model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
