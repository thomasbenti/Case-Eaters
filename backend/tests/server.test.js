import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app, { ready } from "../server.js";

import User from "../models/User.js";
import Post from "../models/Post.js";

describe("Server Functional Tests", () => {
  let token;
  let user;

  beforeAll(async () => {
    await ready;
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    user = await User.create({
      userId: 1,
      firstName: "Functional",
      lastName: "Tester",
      email: "functional@test.com",
      password: "password123",
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // ==========================
  // AUTH ROUTES
  // ==========================
  describe("Auth Routes", () => {
    test("POST /api/auth/register creates a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        userId: 2,
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("newuser@example.com");
      expect(res.body.token).toBeDefined();
    });

    test("POST /api/auth/login logs user in", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "functional@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("functional@test.com");
      expect(res.body.token).toBeDefined();
    });

    test("GET /api/auth/profile returns authenticated user profile", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("functional@test.com");
    });
  });

  // ==========================
  // USER ROUTES
  // ==========================
  describe("User Routes", () => {
    test("GET /api/users returns all users (protected)", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("GET /api/users/:id returns a specific user", async () => {
      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("functional@test.com");
    });
  });

  // ==========================
  // POST ROUTES
  // ==========================
  describe("Post Routes", () => {
    test("POST /api/posts creates a new post", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          postId: 1,
          type: "FreeFood",
          title: "Free Pizza in KSL",
          description: "Come get slices!",
          reporter: user._id,
          location: {
            buildingCode: "KSL",    // VALID
            lat: 41.507,
            lng: -81.609,
          },
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Free Pizza in KSL");
    });

    test("GET /api/posts returns list of posts", async () => {
      await Post.create({
        postId: 2,
        type: "FreeFood",
        title: "Free Coffee",
        description: "Morning coffee in Nord Hall",
        reporter: user._id,
        location: {
          buildingCode: "NOD",  // VALID (Nord Hall)
          lat: 41.504,
          lng: -81.609,
        },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });

      const res = await request(app).get("/api/posts");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("GET /api/posts/:id returns a single post", async () => {
      const created = await Post.create({
        postId: 3,
        type: "MealSwipe",
        title: "Meal Swipe Available",
        description: "Offering a swipe in Tink",
        reporter: user._id,
        location: {
          buildingCode: "TVC", // VALID (Tink)
          lat: 41.505,
          lng: -81.607,
        },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      });

      const res = await request(app).get(`/api/posts/${created._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Meal Swipe Available");
    });
  });
});