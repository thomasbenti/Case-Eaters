import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import postRoutes from "./routes/posts.js"; // ✅ use import instead of require

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Temporary in-memory users (for testing)
const users = [];

// Routes
app.get("/", (req, res) => res.send("API running"));

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Register new user
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send("User created");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

// User login
app.post("/users/login", async (req, res) => {
  const user = users.find((u) => u.username === req.body.username);
  if (!user) return res.status(400).send("Cannot find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.status(403).send("Not allowed");
    }
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

// Post routes (MongoDB-based)
app.use("/api/posts", postRoutes);

//Start server once
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));