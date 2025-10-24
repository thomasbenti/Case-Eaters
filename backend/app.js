import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Root route
app.get("/", (req, res) => {
  res.send("API is running :)");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register user
app.post("/users", async (req, res) => {
  try {
    const { username, email, firstName, lastName, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const lastUser = await User.findOne().sort({ userId: -1 });
    const newUserId = lastUser ? lastUser.userId + 1 : 1;

    const user = await User.create({
      userId: newUserId,
      firstName,
      lastName,
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User login
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Cannot find user");
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      res.json({
        message: "Login successful",
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mealPlan: user.mealPlan,
          receivesNotifications: user.receivesNotifications,
          isActive: user.isActive,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default app;
