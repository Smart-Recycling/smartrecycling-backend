import supertest from "supertest";
import server from "../../lib/testServer";
import { token } from "../db";

const app = server();

describe("Event Controller", () => {
  describe("Create Event", () => {
    it("should create a new event", async () => {
      const response = await supertest(app)
        .post("/api/events")
        .set("Authorization", `${token}`)
        .send({
          title: "Test Event",
          description: "This is a test event.",
          path_image: "/images/test-event.jpg",
          user_id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4",
        });

      expect(response.body.status).toBe(201);
    });
  });

  describe("Get Event", () => {
    it("should get a list of events", async () => {
      const response = await supertest(app).get("/api/events").set("Authorization", `${token}`).expect(200);

      expect(response.body.status).toBe(200);
    });

    it("should return 404 if no Bearer token is provided", async () => {
      const response = await supertest(app).get("/api/events").expect(401);

      expect(response.body.status).toBe(401);
    });
  });

  describe("Update Event", () => {
    it("should update an existing event", async () => {
      const eventId = "2";

      const updatedEvent = {
        title: "Updated Test Event",
        description: "This is an updated test event.",
        path_image: "/images/updated-test-event.jpg",
        user_id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4",
      };

      const response = await supertest(app).put(`/api/events/${eventId}`).set("Authorization", `${token}`).send(updatedEvent).expect(200);

      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe("Event updated successfully");
    });

    it("should return 404 for non-existing event", async () => {
      const nonExistingEventId = "100";

      const updatedEvent = {
        title: "Updated Test Event",
        description: "This is an updated test event.",
        path_image: "/images/updated-test-event.jpg",
        user_id: "123456",
      };

      const response = await supertest(app).put(`/api/events/${nonExistingEventId}`).set("Authorization", `${token}`).send(updatedEvent).expect(404);

      expect(response.body.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
