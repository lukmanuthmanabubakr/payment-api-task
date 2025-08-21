const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    amount: { type: Number, required: true },
    phone: { type: String },
    state: { type: String },
    country: { type: String },
    status: { type: String, default: "pending" },
    reference: { type: String, required: true, unique: true },
    authorization_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
