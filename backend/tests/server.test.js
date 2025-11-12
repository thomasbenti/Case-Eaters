/**
 * Functional tests for Server/App routes (Case Eaters)
 * Covers: SA-1, SA-2, SA-3 from the Functional Test Plan
 */
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";

describe("Server & App Functional Tests", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect("mongodb+srv://tlb102_db_user:N03knbMPVXMbM28F@case-eaters-cluster.nmzvrlw.mongodb.net/?retryWrites=true&w=majority&appName=Case-Eaters-Cluster", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // ---------- SA-1: Server Startup ----------
  test("SA-1: should respond to root route", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API is running :)");
  });

  // ---------- SA-2: Add a user to database ----------
  test("SA-2: should register a new user successfully", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    };

    const res = await request(app).post("/users").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user.email).toBe("john@example.com");

    // Verify database
    const saved = await User.findOne({ email: "john@example.com" });
    expect(saved).not.toBeNull();
    expect(saved.firstName).toBe("John");
  });

  test("should not register user with existing email", async () => {
    const data = {
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      email: "jane@example.com",
      password: "password123",
    };
    await new User({ ...data, userId: 1 }).save();

    const res = await request(app).post("/users").send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  // ---------- SA-3: Get all users ----------
  test("SA-3: should return all users without password field", async () => {
    await new User({
      userId: 10,
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@example.com",
      password: "mypassword",
    }).save();

    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).not.toHaveProperty("password");
    expect(res.body[0].email).toBe("alice@example.com");
  });

  // ---------- User login (derived from SRS login spec) ----------
  test("should login successfully with valid credentials", async () => {
    await request(app).post("/users").send({
      firstName: "Sam",
      lastName: "Lee",
      username: "samlee",
      email: "sam@example.com",
      password: "mypassword",
    });

    const res = await request(app)
      .post("/users/login")
      .send({ email: "sam@example.com", password: "mypassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user.email).toBe("sam@example.com");
  });

  test("should reject invalid login credentials", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "fake@example.com", password: "wrong" });
    expect(res.statusCode).toBe(400);
  });
});