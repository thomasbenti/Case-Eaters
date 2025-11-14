/**
 * @file postController.test.js
 * Cleaned + Fixed Functional Tests for Post Controller
 */

import { jest } from "@jest/globals";
import mongoose from "mongoose";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  flagPost,
  expirePost,
  getPostsByUser,
} from "../controllers/postController.js";

import Post from "../models/Post.js";


// Helper mock factories

const mockSort = (result) => ({
  sort: jest.fn().mockResolvedValue(result),
});

const mockPopulate = (result) => ({
  populate: jest.fn().mockResolvedValue(result),
});

const mockFindChain = (result) => ({
  populate: jest.fn().mockReturnValue(mockSort(result)),
});

const mockFindByIdChain = (result) => ({
  populate: jest.fn().mockResolvedValue(result),
});

const mockFindOneChain = (result) => ({
  sort: jest.fn().mockResolvedValue(result),
});

// --------------------------------------------------

describe("Post Controller Functional Tests", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { _id: new mongoose.Types.ObjectId() },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // PM-1: Create Post
  describe("PM-1: Create Post", () => {
    test("should successfully create a valid post", async () => {
      req.body = {
        type: "FreeFood",
        title: "Pizza Party",
        description: "Leftover pizza",
        location: {
          buildingCode: "THW",
          lat: 41.504,
          lng: -81.609,
        },
        expiresAt: new Date(Date.now() + 3600000),
      };

      const mockPostId = 1;
      const mockPost = {
        _id: "mockId",
        postId: mockPostId,
        ...req.body,
        reporter: req.user._id,
      };

      const populated = {
        ...mockPost,
        reporter: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
      };

      Post.findOne = jest.fn().mockReturnValue(mockFindOneChain(null));
      Post.create = jest.fn().mockResolvedValue(mockPost);
      Post.findById = jest.fn().mockReturnValue(mockFindByIdChain(populated));

      await createPost(req, res);

      expect(Post.findOne).toHaveBeenCalled();
      expect(Post.create).toHaveBeenCalled();

      const created = Post.create.mock.calls[0][0];
      expect(created.postId).toBe(mockPostId);
      expect(created.title).toBe(req.body.title);
      expect(created.location).toEqual(req.body.location);
      expect(created.reporter).toEqual(req.user._id);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(populated);
    });

    test("PM-4: should fail when missing required fields", async () => {
      req.body = { title: "Incomplete" };

      Post.findOne = jest.fn().mockReturnValue(mockFindOneChain(null));
      Post.create = jest
        .fn()
        .mockRejectedValue(new Error("Post validation failed: type is required"));

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });

  // Get All Posts
  describe("Get All Posts", () => {
    test("should retrieve all posts", async () => {
      const mockPosts = [
        { postId: 1, type: "FreeFood", title: "Pizza" },
        { postId: 2, type: "MealSwipe", title: "Swipe" },
      ];

      Post.find = jest.fn().mockReturnValue(mockFindChain(mockPosts));

      await getAllPosts(req, res);

      expect(Post.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    test("should filter posts by type", async () => {
      req.query = { type: "FreeFood" };

      const mockPosts = [{ postId: 1, type: "FreeFood" }];

      Post.find = jest.fn().mockReturnValue(mockFindChain(mockPosts));

      await getAllPosts(req, res);

      expect(Post.find).toHaveBeenCalledWith({ type: "FreeFood" });
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });
  });

  // Get Post By ID
  describe("Get Post By ID", () => {
    test("should retrieve a post", async () => {
      req.params.id = "mockId";

      const mockPost = {
        _id: "mockId",
        title: "Pizza",
      };

      Post.findById = jest.fn().mockReturnValue(mockFindByIdChain(mockPost));

      await getPostById(req, res);

      expect(Post.findById).toHaveBeenCalledWith("mockId");
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    test("should return 404 when missing", async () => {
      req.params.id = "nothing";

      Post.findById = jest.fn().mockReturnValue(mockFindByIdChain(null));

      await getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });
  });

  // Update Post
  describe("Update Post", () => {
    test("should update post when user is reporter", async () => {
      req.params.id = "mockId";
      req.body = { title: "Updated!", description: "Still good" };

      const mockPost = {
        _id: "mockId",
        reporter: req.user._id,
        title: "Old",
        description: "Old desc",
        save: jest.fn().mockResolvedValue({
          _id: "mockId",
          title: req.body.title,
          description: req.body.description,
        }),
      };

      Post.findById = jest
        .fn()
        .mockResolvedValueOnce(mockPost)
        .mockReturnValueOnce(
          mockFindByIdChain({
            ...mockPost,
            title: req.body.title,
            description: req.body.description,
          })
        );

      await updatePost(req, res);

      expect(mockPost.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test("should reject update by non-reporter", async () => {
      req.params.id = "mockId";

      const mockPost = {
        reporter: new mongoose.Types.ObjectId(),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("should return 404 when post missing", async () => {
      req.params.id = "none";
      Post.findById = jest.fn().mockResolvedValue(null);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // PM-2 Delete Post
  describe("Delete Post", () => {
    test("should delete when user is reporter", async () => {
      req.params.id = "mockId";

      const mockPost = {
        reporter: req.user._id,
        deleteOne: jest.fn().mockResolvedValue(true),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);

      await deletePost(req, res);

      expect(mockPost.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Post removed" });
    });

    test("should reject deletion by non-reporter", async () => {
      req.params.id = "mockId";

      const mockPost = {
        reporter: new mongoose.Types.ObjectId(),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("should return 404 when missing", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Flag Post
  describe("Flag Post", () => {
    test("should increment flag", async () => {
      req.params.id = "mockId";

      const mockPost = {
        flagCount: 0,
        isFlagged: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);

      await flagPost(req, res);

      expect(mockPost.flagCount).toBe(1);
      expect(mockPost.isFlagged).toBe(true);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post flagged",
        flagCount: 1,
      });
    });

    test("should return 404", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);
      await flagPost(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Expire Post
  describe("Expire Post", () => {
    test("should expire post when reporter", async () => {
      req.params.id = "mockId";

      const mockPost = {
        reporter: req.user._id,
        isExpired: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);

      await expirePost(req, res);

      expect(mockPost.isExpired).toBe(true);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post marked as expired",
      });
    });

    test("should reject non-reporter", async () => {
      req.params.id = "mockId";

      Post.findById = jest.fn().mockResolvedValue({
        reporter: new mongoose.Types.ObjectId(),
      });

      await expirePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("should 404", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);
      await expirePost(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Get Posts By User
  describe("Get Posts By User", () => {
    test("should retrieve posts", async () => {
      req.params.userId = "mockUser";

      const mockPosts = [
        { postId: 1, reporter: "mockUser" },
        { postId: 2, reporter: "mockUser" },
      ];

      Post.find = jest.fn().mockReturnValue(mockFindChain(mockPosts));

      await getPostsByUser(req, res);

      expect(Post.find).toHaveBeenCalledWith({ reporter: "mockUser" });
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });
  });

  // Error Handling
  describe("Error Handling", () => {
    test("getAllPosts DB error", async () => {
      Post.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error("fail")),
        }),
      });

      await getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test("createPost DB error", async () => {
      req.body = {
        type: "FreeFood",
        title: "Test",
        location: { buildingCode: "THW", lat: 1, lng: 1 },
        expiresAt: new Date(),
      };

      Post.findOne = jest.fn().mockReturnValue(mockFindOneChain(null));
      Post.create = jest.fn().mockRejectedValue(new Error("fail"));

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("getPostById DB error", async () => {
      req.params.id = "test";

      Post.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("fail")),
      });

      await getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});