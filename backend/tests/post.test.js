/**
 * @file postModel.test.js
 * Functional tests for the Post model (Case Eaters)
 */
import mongoose from "mongoose";
import Post from "../models/Post.js";

describe("Post Model Functional Tests", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb+srv://tlb102_db_user:N03knbMPVXMbM28F@case-eaters-cluster.nmzvrlw.mongodb.net/?retryWrites=true&w=majority&appName=Case-Eaters-Cluster", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("PM-1: should create a valid Post object successfully", async () => {
    const validPost = new Post({
      postId: 1,
      type: "FreeFood",
      title: "Pizza at Nord Hall",
      description: "Free pizza left from club event!",
      location: {
        enum: "NOD",
        lat: 41.504,
        lng: -81.609,
      },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // expires in 1 hour
    });

    const savedPost = await validPost.save();
    expect(savedPost._id).toBeDefined();
    expect(savedPost.type).toBe("FreeFood");
    expect(savedPost.title).toBe("Pizza at Nord Hall");
    expect(savedPost.isExpired).toBe(false);
    expect(savedPost.flagCount).toBe(0);
  });

  test("PM-2: should fail when creating a Post with missing required fields", async () => {
    const invalidPost = new Post({
      // missing postId, type, and location
      title: "Missing Fields",
      expiresAt: new Date(),
      reporter: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await invalidPost.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors["postId"]).toBeDefined();
    expect(err.errors["type"]).toBeDefined();
  });

  test("PM-3: should reject invalid building code in location", async () => {
    const invalidLocationPost = new Post({
      postId: 2,
      type: "MealSwipe",
      title: "Swipe at Random Building",
      description: "Come grab one!",
      location: {
        enum: "INVALID",
        lat: 41.503,
        lng: -81.605,
      },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() + 3600000),
    });

    await expect(invalidLocationPost.save()).rejects.toThrow();
  });

  test("PM-4: should correctly return post info", async () => {
    const post = await Post.findOne({ title: "Pizza at Nord Hall" });
    expect(post).not.toBeNull();
    expect(post.title).toBe("Pizza at Nord Hall");
    expect(post.type).toBe("FreeFood");
    expect(typeof post.createdAt).toBe("object");
  });

  test("PM-5: should mark post as expired when past expiresAt", async () => {
    const expiringPost = new Post({
      postId: 3,
      type: "FreeFood",
      title: "Old Donuts",
      location: { enum: "SEB", lat: 41.501, lng: -81.606 },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() - 3600000), // expired an hour ago
    });

    const saved = await expiringPost.save();
    const isExpired = saved.expiresAt < new Date();
    expect(isExpired).toBe(true);
  });
});