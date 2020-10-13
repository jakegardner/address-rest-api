const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  deletedAt: { type: Date },

  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

addressSchema.index({ state: 1, country: 1 });

module.exports = mongoose.model('Address', addressSchema);
