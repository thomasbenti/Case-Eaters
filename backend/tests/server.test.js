import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

describe("Server API endpoints", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("GET / should return API is running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API is running :)");
  });

  it("GET /nonexistent should return 404", async () => {
    const res = await request(app).get("/nonexistent");
    expect(res.statusCode).toBe(404);
  });
});