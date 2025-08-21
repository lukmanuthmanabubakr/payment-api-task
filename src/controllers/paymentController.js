const paystack = require("../config/paystack");
const Payment = require("../models/Payment");
const crypto = require("crypto");

exports.initiatePayment = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, state, country, amount } =
      req.body;

    if (!firstName || !lastName || !email || !amount) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields required" });
    }

    const reference = crypto.randomUUID();

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100,
      reference,
    });

    const payment = new Payment({
      customer_name: `${firstName} ${lastName}`,
      customer_email: email,
      phone,
      state,
      country,
      amount,
      reference,
      status: "pending",
      authorization_url: response.data.data.authorization_url,
    });

    await payment.save();

    res.status(201).json({
      payment,
      status: "success",
      message: "Payment initiated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


exports.getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ reference: id });
    if (!payment) {
      return res
        .status(404)
        .json({ status: "error", message: "Payment not found" });
    }

    const response = await paystack.get(`/transaction/verify/${id}`);
    payment.status = response.data.data.status;
    await payment.save();

    const paymentResponse = {
      id: payment._id,
      customer_name: payment.customer_name,
      customer_email: payment.customer_email,
      phone: payment.phone,
      state: payment.state,
      country: payment.country,
      amount: payment.amount,
      status: payment.status,
      reference: payment.reference,
      authorization_url: payment.authorization_url,
    };

    res.json({
      payment: paymentResponse,
      status: "success",
      message: "Payment details retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
