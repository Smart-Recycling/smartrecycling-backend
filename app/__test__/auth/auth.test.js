import supertest from "supertest";
import server from "../../lib/testServer";
import dbPool from "../../lib/dbConnect.js";

const app = server();
const connection = dbPool();

describe("POST User Authentication (/auth)", () => {
  const random = Math.floor(Math.random() * 1000);

  it("should return 201 if creating account", async () => {
    const account = {
      name: "Jest Test Account",
      email: `jesttest${random}@gmail.com`,
      password: "jest123",
    };

    await supertest(app).post("/api/signup").send(account).expect(201);
  });

  it("should return 400 if email already exist", async () => {
    const accountDetail = {
      name: "Jest Test Account",
      email: "jesttest4@gmail.com",
      password: "jest123",
    };

    await supertest(app).post("/api/signup").send(accountDetail).expect(400);
  });

  it("should return 400 if email and password are empty", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        name: "",
        email: "",
        password: ""
      })

    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Email and password are required."
    })
  });

  it("should return 400 if email is empty", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        name: "Jest Test Account",
        email: "",
        password: "jest123"
      })

    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Email and password are required."
    })
  });

  it("should return 400 if password is empty", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .send({
        name: "Jest Test Account",
        email: "",
        password: "jest123"
      })

    expect(response.body.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: "Email and password are required."
    })
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

  it("should return 404 if email not found", async () => {
    const response = await supertest(app)
      .post('/api/signin')
      .send({
        email: "jesttest200@gmail.com",
        password: "password"
      })

    expect(response.body.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    })
  });

  it("should return 404 if email and password are incorrect", async () => {
    const response = await supertest(app)
      .post("/api/signin")
      .send({
        email: "",
        password: ""
      })

    expect(response.body.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    })
  })
});

describe("POST signout (/signout)", () => {
  beforeAll(async () => {
    await connection.query("INSERT INTO RefreshToken (user_id, token) VALUES ('d0d30848-6dc6-460b-90e4-ab3f16c06df4', 'test')");
  })

  it("should return 200", async () => {
    const response = await supertest(app)
      .post("/api/signout")
      .send({
        user: {
          id: "d0d30848-6dc6-460b-90e4-ab3f16c06df4"
        }
      })

    expect(response.body.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      message: "Successfully logged out"
    })
  });

  it("should return 404 if user not found", async () => {
    const response = await supertest(app)
      .post("/api/signout")
      .send({
        user: {
          id: "invalid"
        }
      })

    expect(response.body.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found"
    })
  });
});