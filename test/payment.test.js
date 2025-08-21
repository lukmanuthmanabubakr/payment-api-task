require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Payment API", () => {
  let paymentReference;

  it("POST /api/v1/payments should initiate a payment", async () => {
    const res = await request(app).post("/api/v1/payments").send({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      amount: 1000,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment).toHaveProperty("reference");
    paymentReference = res.body.payment.reference;
  });

  it("GET /api/v1/payments/:id should return payment status", async () => {
    const res = await request(app).get(`/api/v1/payments/${paymentReference}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.payment).toHaveProperty("status");
  });
});
