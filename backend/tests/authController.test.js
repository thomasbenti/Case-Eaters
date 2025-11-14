/**
 * @file authController.test.js
 */

import { registerUser, loginUser } from "../controllers/authController.js";
import { jest } from "@jest/globals";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Ensure required secret exists
process.env.JWT_SECRET = "testsecret";

describe("Authentication Controller Functional Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  /**
   * Utility: mock chained User.findOne().sort()
   */
  const mockFindOneWithSort = (result) => {
    User.findOne = jest.fn(() => ({
      sort: jest.fn().mockResolvedValue(result),
    }));
  };

  // FT-A1: Register Success
  test("FT-A1: should register a new user successfully", async () => {
    req.body = {
      email: "auth@example.com",
      password: "secure123",
      firstName: "Auth",
      lastName: "Tester",
      mealPlan: true,
    };

    // First findOne → duplicate check
    // Second findOne() → last userId lookup with .sort()
    User.findOne = jest
      .fn()
      .mockResolvedValueOnce(null) // no duplicate
      .mockReturnValueOnce({
        sort: jest.fn().mockResolvedValue(null),
      });

    User.create = jest.fn().mockResolvedValue({
      _id: "123",
      userId: 1,
      ...req.body,
    });

    jwt.sign = jest.fn().mockReturnValue("mockedToken");

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // FT-A2: Prevent duplicate registration
  test("FT-A2: should prevent duplicate registration", async () => {
    req.body = {
      email: "auth@example.com",
      password: "duplicate123",
    };

    User.findOne = jest.fn().mockResolvedValue({ email: "auth@example.com" });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // FT-A3: Login success
  test("FT-A3: should login with valid credentials", async () => {
    req.body = { email: "auth@example.com", password: "secure123" };

    User.findOne = jest.fn().mockResolvedValue({
      _id: "111",
      email: "auth@example.com",
      password: "hashedPass",
      matchPassword: jest.fn().mockResolvedValue(true),
    });

    jwt.sign = jest.fn().mockReturnValue("mockedToken");

    await loginUser(req, res);

    // Controller does NOT call res.status(200)
    // It implicitly returns 200 through res.json()
    expect(res.json).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  // FT-A4: Login invalid password
  test("FT-A4: should reject login with invalid password", async () => {
    req.body = { email: "auth@example.com", password: "wrong" };

    User.findOne = jest.fn().mockResolvedValue({
      _id: "111",
      email: "auth@example.com",
      password: "hashedPass",
      matchPassword: jest.fn().mockResolvedValue(false),
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});