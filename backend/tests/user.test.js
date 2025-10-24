import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path if needed

describe("User Model", () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB or test database
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should create a user with required fields", async () => {
    const user = new User({
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("john@example.com");
    expect(savedUser.password).not.toBe("password123"); // should be hashed
  });

  it("should not allow duplicate email", async () => {
    const userData = {
      userId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "password123",
    };

    await new User(userData).save();
    await expect(new User(userData).save()).rejects.toThrow();
  });

  it("should hash password before saving", async () => {
    const plainPassword = "password123";
    const user = new User({
      userId: 3,
      firstName: "Jake",
      lastName: "Miller",
      email: "jake@example.com",
      password: plainPassword,
    });
    await user.save();

    expect(user.password).not.toBe(plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).toBe(true);
  });

  it("should compare password correctly using matchPassword", async () => {
    const user = new User({
      userId: 4,
      firstName: "Sam",
      lastName: "Lee",
      email: "sam@example.com",
      password: "mypassword",
    });
    await user.save();

    const isMatch = await user.matchPassword("mypassword");
    const isNotMatch = await user.matchPassword("wrongpassword");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it("should apply default values for boolean fields", async () => {
    const user = new User({
      userId: 5,
      firstName: "Anna",
      lastName: "Wong",
      email: "anna@example.com",
      password: "testpass",
    });
    const savedUser = await user.save();

    expect(savedUser.mealPlan).toBe(false);
    expect(savedUser.receivesNotifications).toBe(true);
    expect(savedUser.isActive).toBe(true);
  });
});