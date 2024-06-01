import supertest from "supertest";
import server from "../../lib/testServer";

const app = server();

describe("POST User Authentication (/auth)", () => {
  describe("Creating  User Account (/signup)", () => {
    const random = Math.floor(Math.random() * 1000);
    it("should return 201", async () => {
      const account = {
        name: "Jest Test Account",
        email: `jesttest${random}@gmail.com`,
        password: "jest123",
      };

      await supertest(app).post("/api/signup").send(account).expect(201);
    });
  });
});

describe("Creating User Account with Exist Email (/signup)", () => {
  it("should return 400", async () => {
    const accountDetail = {
      name: "Jest Test Account",
      email: "jesttest4@gmail.com",
      password: "jest123",
    };

    await supertest(app).post("/api/signup").send(accountDetail).expect(400);
  });
});

describe("Login User Account (/signin)", () => {
  it("should return 200", async () => {
    const accountDetail = {
      email: "jesttest4@gmail.com",
      password: "jest123",
    };

    await supertest(app).post("/api/signin").send(accountDetail).expect(200);
  });
});

describe("Login User Account where password incorrect (/signin)", () => {
  it("should return 422", async () => {
    const accountDetail = {
      email: "jesttest4@gmail.com",
      password: "1234424132",
    };

    await supertest(app).post("/api/signin").send(accountDetail).expect(422);
  });
});
