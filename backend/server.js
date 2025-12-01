import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// ----------------- CORS (safe, express-version-agnostic) -----------------
const CORS_ORIGIN = "http://localhost:5173";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
// ----------------------------------------------------------------------

app.use(express.json());
connectDB();

const users = [];

// Root route
app.get("/", (req, res) => {
  res.send("API is running :)");
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// register user
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
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// user login
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
          isActive: user.isActive
        }
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

export const ready = mongoose.connection.asPromise();
export default app;
