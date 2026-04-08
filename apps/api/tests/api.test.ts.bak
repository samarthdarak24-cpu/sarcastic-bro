import request from "supertest";
import app from "../src/app";

describe("Health Check", () => {
  it("GET /health returns 200 and OK status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("OK");
    expect(res.body.data.service).toBe("ODOP Connect API");
  });
});

describe("404 Handler", () => {
  it("GET /nonexistent-route returns 404", async () => {
    const res = await request(app).get("/nonexistent-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("Auth Module", () => {
  const testUser = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "Test@12345",
    role: "FARMER",
    district: "Jaipur",
    state: "Rajasthan",
  };

  let accessToken: string;

  it("POST /auth/register returns tokens and a user record", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("tokens");
    expect(res.body.data.tokens).toHaveProperty("accessToken");
    accessToken = res.body.data.tokens.accessToken;
  });

  it("POST /auth/login works with a valid identifier", async () => {
    const res = await request(app).post("/auth/login").send({
      identifier: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("tokens");
    accessToken = res.body.data.tokens.accessToken;
  });

  it("POST /auth/login rejects an invalid password", async () => {
    const res = await request(app).post("/auth/login").send({
      identifier: testUser.email,
      password: "WrongPassword",
    });
    expect(res.status).toBe(401);
  });

  it("GET /auth/me returns the current user profile", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("GET /auth/me rejects anonymous access", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("Products Module", () => {
  let accessToken: string;

  beforeAll(async () => {
    const user = {
      name: "Farmer For Products",
      email: `farmer-product-${Date.now()}@example.com`,
      password: "Test@12345",
      role: "FARMER",
      district: "Pune",
      state: "Maharashtra",
    };

    const res = await request(app).post("/auth/register").send(user);
    accessToken = res.body.data.tokens.accessToken;
  });

  it("GET /products returns a product list", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /products creates a product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Turmeric",
        category: "Spices",
        price: 120,
        unit: "kg",
        quantity: 500,
        district: "Pune",
        state: "Maharashtra",
      });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Turmeric");
  });

  it("POST /products rejects anonymous creation", async () => {
    const res = await request(app).post("/products").send({
      name: "Should Fail",
      category: "Grains",
      price: 50,
      district: "Jaipur",
      state: "Rajasthan",
    });
    expect(res.status).toBe(401);
  });
});

describe("Search Module", () => {
  it("GET /search returns 200 even when Elasticsearch is unavailable", async () => {
    const res = await request(app).get("/search?q=turmeric");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
