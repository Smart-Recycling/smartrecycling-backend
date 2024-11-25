import supertest from "supertest";
import testServer from "../../lib/testServer";
import { token } from "../db";

const app = testServer();

describe("Report Controller", () => {
  describe("Get Report", () => {
    it("should get a list of reports", async () => {
      const response = await supertest(app).get("/api/report").set("Authorization", token).expect(200);

      expect(response.body.status).toBe(200);
    });

    it("should return 401 if no Bearer token is provided", async () => {
      const response = await supertest(app).get("/api/report").expect(401);

      expect(response.body.status).toBe(401);
    });
  });

  describe("Create Report", () => {
    // it("should create a new report", async () => {
    //   const newReport = {
    //     email: "testadmin@gmail.com",
    //     subject: "Test Report",
    //     location: "Test Location",
    //     user_id: "784cb972-734d-4461-9d15-34ddac8c4a6d",
    //   };

    //   const response = await supertest(app).post("/api/report").set("Authorization", token).send(newReport).expect(201);

    //   expect(response.body.status).toBe(201);
    // });

    it("should return 404 if user_id is false", async () => {
      const newReport = {
        email: "test@example.com",
        subject: "Test Report",
        location: "Test Location",
        user_id: 100,
      };

      await supertest(app).post("/report").send(newReport).expect(404);
    });
  });
});
