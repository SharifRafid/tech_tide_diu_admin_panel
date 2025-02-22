import mongoose from 'mongoose';

export const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Source = mongoose.models.Source || mongoose.model('Source', SourceSchema);

export default Source;
