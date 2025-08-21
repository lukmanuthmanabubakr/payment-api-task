const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parse x-www-form-urlencoded
app.use(express.json()); // Parse JSON

// versioning
app.use("/api/v1/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Payment API is running" });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}