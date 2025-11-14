/**
 * @file authMiddleware.test.js
 */

import { protect, admin } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jest } from "@jest/globals";

describe("Auth Middleware Functional Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  // Utility to mock User.findById().select()
  const mockFindByIdSelect = (result) => {
    User.findById = jest.fn(() => ({
      select: jest.fn().mockResolvedValue(result),
    }));
  };

  // FT-M1 — No Token Provided
  test("FT-M1: should return 401 when no token is provided", async () => {
    req.headers.authorization = undefined;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  // FT-M2 — Invalid Token
  test("FT-M2: should return 401 for invalid token", async () => {
    req.headers.authorization = "Bearer invalidtoken";

    jwt.verify = jest.fn(() => {
      throw new Error("Token failed");
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token failed" });
    expect(next).not.toHaveBeenCalled();
  });

  // FT-M3 — Valid Token but User Inactive
  test("FT-M3: should return 401 if user is inactive", async () => {
    req.headers.authorization = "Bearer validtoken";

    jwt.verify = jest.fn(() => ({ id: "123" }));

    mockFindByIdSelect({
      _id: "123",
      isActive: false,
    });

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "User account is inactive",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // FT-M4 — Valid Token + Active User → next()
  test("FT-M4: should attach user to req and call next() when token is valid", async () => {
    req.headers.authorization = "Bearer goodtoken";

    jwt.verify = jest.fn(() => ({ id: "123" }));

    const mockUser = {
      _id: "123",
      firstName: "Tester",
      isActive: true,
    };

    mockFindByIdSelect(mockUser);

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  // FT-M5 — Admin Middleware Success
  test("FT-M5: admin middleware should call next() when user is admin", () => {
    req.user = { isAdmin: true };

    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // FT-M6 — Admin Middleware Failure
  test("FT-M6: admin middleware should return 403 when user is NOT admin", () => {
    req.user = { isAdmin: false };

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized as admin",
    });
    expect(next).not.toHaveBeenCalled();
  });
});