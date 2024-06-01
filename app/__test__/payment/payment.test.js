import supertest from "supertest";
import testServer from "../../lib/testServer";
import { token } from "../db";

const app = testServer();

describe("Payment Controller", () => {
  describe("Get Payment History", () => {
    it("should get payment history for a user", async () => {
      const userId = "784cb972-734d-4461-9d15-34ddac8c4a6d";

      const response = await supertest(app).get(`/api/payment-history/${userId}`).set("Authorization", token).expect(200);

      expect(response.body.status).toBe(200);
    });

    it("should return 404 if the user is not found", async () => {
      const userId = 999;

      const response = await supertest(app).get(`/api/payment-history/${userId}`).set("Authorization", token).expect(404);

      expect(response.body.status).toBe(404);
    });
  });

  describe("Create Payment Method", () => {
    it("should create a new payment method", async () => {
      const newPaymentMethod = {
        user_id: "784cb972-734d-4461-9d15-34ddac8c4a6d",
        method_type: "QRIS",
        card_number: "1234567890123456",
        expiration_date: "2023-12-31",
        cvv: "123",
      };

      const response = await supertest(app).post("/api/payment-method").set("Authorization", token).send(newPaymentMethod).expect(201);

      expect(response.body.status).toBe(201);
    });

    it("should return 404 if the user is not found", async () => {
      const newPaymentMethod = {
        user_id: 999,
        method_type: "QRIS",
        card_number: "1234567890123456",
        expiration_date: "2023-12-31",
        cvv: "123",
      };

      const response = await supertest(app).post("/api/payment-method").set("Authorization", token).send(newPaymentMethod).expect(404);

      expect(response.body.status).toBe(404);
    });
  });
});
