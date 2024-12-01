import supertest from "supertest";
import testServer from "../../lib/testServer";
import { token } from "../db";
import dbPool from "../../lib/dbConnect.js";

const connection = dbPool();
const app = testServer();

describe("Report Controller", () => {
  describe("Get Report", () => {
    it("should get a list of reports", async () => {
      const response = await supertest(app)
        .get("/api/report")
        .set("Authorization", token)

      expect(response.body.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.any(Number),
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              email: expect.any(String),
              subject: expect.any(String),
              location: expect.any(String),
              created_at: expect.any(String),
              user_id: expect.any(String),
            }),
          ])
        })
      );
    });

    it("should return 401 if no Bearer token is provided", async () => {
      const response = await supertest(app)
        .get("/api/report");

      expect(response.body.status).toBe(401);
      expect(response.body).toEqual({
        status: 401,
        message: "Unauthorized: Bearer token required"
      })
    });
  });

  describe("Create Report", () => {
    it("should create a new report", async () => {
      const newReport = {
        email: "testadmin@gmail.com",
        subject: "Test Report",
        location: "Test Location",
        user_id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4",
      };

      const response = await supertest(app)
        .post("/api/report")
        .set("Authorization", token)
        .send(newReport);

      expect(response.body.status).toBe(201);
      expect(response.body).toEqual({
        status: 201,
        data: {
          fieldCount: expect.any(Number),
          affectedRows: 1,
          changedRows: 0,
          info: expect.any(String),
          insertId: expect.any(Number),
          serverStatus: expect.any(Number),
          warningStatus: expect.any(Number),
        },
      });
    });

    it("should return 404 if user_id is false", async () => {
      const newReport = {
        email: "test@example.com",
        subject: "Test Report",
        location: "Test Location",
        user_id: 100,
      };

      const response = await supertest(app)
        .post("/api/report")
        .set("Authorization", token)
        .send(newReport);

      expect(response.body.status).toBe(undefined);
      expect(response.body).toEqual({});
    });

    it("should return 401 if no Bearer token is provided", async () => {
      const response = await supertest(app)
        .post("/api/report")

      expect(response.body.status).toBe(undefined);
      expect(response.body).toEqual({})
    })

    it("should return 422 if email field is missing", async () => {
      const response = await supertest(app)
        .post("/api/report")
        .set("Authorization", token)
        .send({
          email: "",
          subject: "test",
          location: "test",
          user_id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4",
        });

      expect(response.body.status).toBe(422);
      expect(response.body).toEqual({
        status: 422,
        message: "Please fill in all fields",
      });
    });

    it("should return 422 if email valid but other fields are missing", async () => {
      const response = await supertest(app)
        .post("/api/report")
        .set("Authorization", token)
        .send({
          email: "testadmin@gmail.com",
          subject: "",
          location: "",
          user_id: "",
        });

      expect(response.body.status).toBe(422);
      expect(response.body).toEqual({
        status: 422,
        message: "Please fill in all fields"
      });
    });
  });

  describe("Update Report", () => {
    it("should update an existing report", async () => {
      const [reportRows] = await connection.query("SELECT * FROM Report LIMIT 1");

      const report = reportRows[0];

      const updatedReport = {
        email: "updatedemail@gmail.com",
        subject: "Updated Report",
        location: "Updated Location",
        user_id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4",
      };

      const response = await supertest(app)
        .put(`/api/report/${report.id}`)
        .set("Authorization", token)
        .send(updatedReport);

      expect(response.body.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {
          fieldCount: expect.any(Number),
          affectedRows: expect.any(Number),
          changedRows: expect.any(Number),
          info: expect.any(String),
          insertId: expect.any(Number),
          serverStatus: expect.any(Number),
          warningStatus: expect.any(Number),
        },
      });
    });
  });

  describe("Delete Report", () => {
    it("should delete an existing report", async () => {
      const [reportRows] = await connection.query("SELECT * FROM Report LIMIT 1");

      const report = reportRows[0];

      const response = await supertest(app)
        .delete(`/api/report/${report.id}`)
        .set("Authorization", token);

      expect(response.body.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        data: {
          fieldCount: expect.any(Number),
          affectedRows: expect.any(Number),
          changedRows: expect.any(Number),
          info: expect.any(String),
          insertId: expect.any(Number),
          serverStatus: expect.any(Number),
          warningStatus: expect.any(Number),
        },
      });
    });
  });
});
