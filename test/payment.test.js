const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const axios = require("axios");

// Mock axios so Paystack calls don't actually run
jest.mock("axios");

beforeAll(async () => {
  // connect to test DB
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Payment API", () => {
  let paymentReference;

  it("POST /api/v1/payments should initiate a payment", async () => {
    // Mock the Paystack response
    axios.post.mockResolvedValue({
      data: {
        data: {
          authorization_url: "https://paystack.com/fake-url"
        }
      }
    });

    const res = await request(app)
      .post("/api/v1/payments")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        amount: 1000
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
