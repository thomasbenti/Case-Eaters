/**
 * @file postModel.test.js
 * Functional tests for the Post model (Case Eaters)
 */
import mongoose from "mongoose";
import Post from "../models/Post.js";

describe("Post Model Functional Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://tlb102_db_user:N03knbMPVXMbM28F@case-eaters-cluster.nmzvrlw.mongodb.net/test-db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // ------------------------------------------------
  // PM-1: Valid Post Creation
  // ------------------------------------------------
  test("PM-1: should create a valid Post object successfully", async () => {
    const validPost = new Post({
      postId: 1,
      type: "FreeFood",
      title: "Pizza at Nord Hall",
      description: "Free pizza left from club event!",
      location: {
        buildingCode: "NOD",
        lat: 41.504,
        lng: -81.609,
      },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() + 3600000),
    });

    const savedPost = await validPost.save();

    expect(savedPost._id).toBeDefined();
    expect(savedPost.type).toBe("FreeFood");
    expect(savedPost.location.buildingCode).toBe("NOD");
    expect(savedPost.flagCount).toBe(0);
  });

  // ------------------------------------------------
  // PM-2: Required field validation
  // ------------------------------------------------
  test("PM-2: should fail when required fields are missing", async () => {
    const invalidPost = new Post({
      title: "Missing Fields",
      expiresAt: new Date(),
      reporter: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await invalidPost.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.postId).toBeDefined();
    expect(err.errors.type).toBeDefined();
    expect(err.errors["location.buildingCode"]).toBeDefined();
  });

  // ------------------------------------------------
  // PM-3: Invalid buildingCode
  // ------------------------------------------------
  test("PM-3: should reject invalid building code", async () => {
    const invalidLocationPost = new Post({
      postId: 2,
      type: "MealSwipe",
      title: "Bad Building",
      location: {
        buildingCode: "INVALID",
        lat: 41.503,
        lng: -81.605,
      },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() + 3600000),
    });

    await expect(invalidLocationPost.save()).rejects.toThrow();
  });

  // ------------------------------------------------
  // PM-4: Retrieval of existing post
  // ------------------------------------------------
  test("PM-4: should correctly return post info", async () => {
    const post = await Post.findOne({ title: "Pizza at Nord Hall" });

    expect(post).not.toBeNull();
    expect(post.title).toBe("Pizza at Nord Hall");
    expect(post.location.buildingCode).toBe("NOD");
    expect(typeof post.createdAt).toBe("object");
  });

  // ------------------------------------------------
  // PM-5: Expiration logic
  // ------------------------------------------------
  test("PM-5: should mark post as expired when expiresAt has passed", async () => {
    const expiredPost = new Post({
      postId: 3,
      type: "FreeFood",
      title: "Old Donuts",
      location: {
        buildingCode: "SEB",
        lat: 41.501,
        lng: -81.606,
      },
      reporter: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() - 3600000),
    });

    const saved = await expiredPost.save();

    expect(saved.expiresAt < new Date()).toBe(true);
  });
});