/**
 * @file userController.test.js
 */

import {
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

import { jest } from "@jest/globals";
import User from "../models/User.js";

describe("User Controller Functional Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { _id: "123" }, body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Utility: mock User.findById()
  const mockFindById = (result) => {
    User.findById = jest.fn().mockResolvedValue(result);
  };

  // Utility: mock .select()
  const mockFindByIdWithSelect = (result) => {
    User.findById = jest.fn(() => ({
      select: jest.fn().mockResolvedValue(result),
    }));
  };

  // Utility: mock User.find().select()
  const mockFindSelect = (result) => {
    User.find = jest.fn(() => ({
      select: jest.fn().mockResolvedValue(result),
    }));
  };

  // FT-U1 — Update User Profile SUCCESS
  test("FT-U1: should update user profile successfully", async () => {
    req.body = {
      firstName: "New",
      lastName: "Name",
      email: "updated@example.com",
      mealPlan: false,
      receivesNotifications: true,
      password: "newpass123",
    };

    const mockUser = {
      _id: "123",
      userId: 50,
      firstName: "Old",
      lastName: "User",
      email: "old@example.com",
      mealPlan: true,
      receivesNotifications: false,
      password: "oldpass",
      save: jest.fn().mockResolvedValue({
        _id: "123",
        userId: 50,
        ...req.body,
      }),
    };

    mockFindById(mockUser);

    await updateUserProfile(req, res);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      _id: "123",
      userId: 50,
      firstName: "New",
      lastName: "Name",
      email: "updated@example.com",
      mealPlan: false,
      receivesNotifications: true,
    });
  });

  // FT-U2 — Update User Profile (User Not Found)
  test("FT-U2: should return 404 if user not found during update", async () => {
    mockFindById(null);

    await updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  // FT-U3 — Delete User Account SUCCESS (Soft Delete)
  test("FT-U3: should deactivate user account", async () => {
    const mockUser = {
      _id: "123",
      isActive: true,
      save: jest.fn(),
    };

    mockFindById(mockUser);

    await deleteUserAccount(req, res);

    expect(mockUser.isActive).toBe(false);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "User account deactivated" });
  });

  // FT-U4 — Delete User (User Not Found)
  test("FT-U4: should return 404 if user not found during delete", async () => {
    mockFindById(null);

    await deleteUserAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  // FT-U5 — Get All Users
  test("FT-U5: should return all active users", async () => {
    const users = [
      { _id: "1", firstName: "A" },
      { _id: "2", firstName: "B" },
    ];

    mockFindSelect(users);

    await getAllUsers(req, res);

    expect(User.find).toHaveBeenCalledWith({ isActive: true });
    expect(res.json).toHaveBeenCalledWith(users);
  });

  // FT-U6 — Get User By ID SUCCESS
  test("FT-U6: should return a user by ID", async () => {
    const user = { _id: "123", firstName: "Test" };
    req.params.id = "123";

    mockFindByIdWithSelect(user);

    await getUserById(req, res);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith(user);
  });

  // FT-U7 — Get User By ID Not Found
  test("FT-U7: should return 404 if user not found", async () => {
    req.params.id = "999";

    mockFindByIdWithSelect(null);

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});