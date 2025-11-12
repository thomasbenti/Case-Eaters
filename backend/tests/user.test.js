/**
 * Functional Jest tests for the User model
 * Covers: UM-1 (valid user object), UM-2 (return info), UM-3 (password validation)
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

describe("User Model Functional Tests", () => {
  beforeAll(async () => {
    // Use local or in-memory MongoDB for testing
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

  // ---------- UM-1: Determine a valid User object ----------
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
    expect(savedUser.password).not.toBe("password123"); // password hashed
  });

  // ---------- UM-1 (negative variant): invalid email ----------
  test("should reject invalid email format", async () => {
    const user = new User({
      userId: 102,
      firstName: "Invalid",
      lastName: "Email",
      email: "invalidEmail",
      password: "pass123",
    });
    await expect(user.save()).rejects.toThrow(/valid email address/);
  });

  // ---------- UM-2: Return the info of the User ----------
  test("UM-2: should retrieve stored user info", async () => {
    const newUser = await new User({
      userId: 103,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "mypassword",
    }).save();

    const foundUser = await User.findOne({ email: "alice@example.com" });
    expect(foundUser.firstName).toBe("Alice");
    expect(foundUser.lastName).toBe("Smith");
    expect(foundUser.email).toBe("alice@example.com");
    expect(typeof foundUser.password).toBe("string");
    expect(foundUser.password).not.toBe("mypassword");
  });

  // ---------- UM-3: Password comparison ----------
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

  // ---------- Duplicate email check ----------
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

  // ---------- Password hashing ----------
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
  });

  // ---------- Default field values ----------
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