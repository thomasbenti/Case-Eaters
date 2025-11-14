/**
 * Functional Jest tests for the User model
 * Covers:
 *  - UM-1: valid user object
 *  - UM-1b: invalid email format
 *  - UM-1c: missing required fields
 *  - UM-2: user retrieval
 *  - UM-3: password comparison
 *  - UM-4: password required
 *  - Duplicate email
 *  - Password hashing
 *  - Default fields
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

describe("User Model Functional Tests", () => {
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

  afterEach(async () => {
    await User.deleteMany({});
  });

  // UM-1: Valid User Object
  test("UM-1: should create a valid User object", async () => {
    const user = new User({
      userId: 101,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("john@example.com");
    expect(savedUser.password).not.toBe("password123");
  });

  // UM-1b: Invalid Email
  test("UM-1b: should reject invalid email format", async () => {
    const user = new User({
      userId: 102,
      firstName: "Bad",
      lastName: "Email",
      email: "not-an-email",
      password: "pass123",
    });

    await expect(user.save()).rejects.toThrow(/valid email address/);
  });

  // UM-1c: Missing Required Fields
  test("UM-1c: should fail if required fields are missing", async () => {
    const user = new User({
      email: "missing@fields.com",
      password: "pass123",
    });

    await expect(user.save()).rejects.toThrow();
  });

  // UM-4: Password Required Validation
  test("UM-4: should require a password", async () => {
    const user = new User({
      userId: 200,
      firstName: "No",
      lastName: "Password",
      email: "nopass@example.com",
      // missing password
    });

    await expect(user.save()).rejects.toThrow(/password/);
  });

  // UM-2: Retrieve User Info
  test("UM-2: should retrieve stored user info", async () => {
    await new User({
      userId: 103,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "mypassword",
    }).save();

    const user = await User.findOne({ email: "alice@example.com" });

    expect(user.firstName).toBe("Alice");
    expect(user.lastName).toBe("Smith");
    expect(user.email).toBe("alice@example.com");
    expect(user.password).not.toBe("mypassword");
  });

  // UM-3: Password Comparison
  test("UM-3: should verify password using matchPassword()", async () => {
    const user = await new User({
      userId: 104,
      firstName: "Sam",
      lastName: "Lee",
      email: "sam@example.com",
      password: "securepass",
    }).save();

    const match = await user.matchPassword("securepass");
    const mismatch = await user.matchPassword("wrongpass");

    expect(match).toBe(true);
    expect(mismatch).toBe(false);
  });

  // Duplicate Email
  test("should not allow duplicate email addresses", async () => {
    const data = {
      userId: 105,
      firstName: "Jane",
      lastName: "Roe",
      email: "jane@example.com",
      password: "abc123",
    };

    await new User(data).save();

    await expect(new User({ ...data, userId: 106 }).save()).rejects.toThrow();
  });

  // Password Hashing Behavior
  test("should hash password before saving", async () => {
    const plain = "rawPassword";

    const user = await new User({
      userId: 107,
      firstName: "Tom",
      lastName: "Miller",
      email: "tom@example.com",
      password: plain,
    }).save();

    expect(user.password).not.toBe(plain);

    const verified = await bcrypt.compare(plain, user.password);
    expect(verified).toBe(true);
    expect(user.password.startsWith("$2")).toBe(true);
  });

  // Default Values
  test("should apply default values for boolean fields", async () => {
    const user = await new User({
      userId: 108,
      firstName: "Anna",
      lastName: "Wong",
      email: "anna@example.com",
      password: "pass",
    }).save();

    expect(user.mealPlan).toBe(false);
    expect(user.receivesNotifications).toBe(true);
    expect(user.isActive).toBe(true);
  });
});