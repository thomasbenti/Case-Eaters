const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// frontend
app.use(cors({ origin: "http://localhost:5177" })); 
app.use(bodyParser.json());

// dummy posts
let posts = [];

// POST route
app.post("/posts/create", (req, res) => {
  const post = { ...req.body, postId: posts.length + 1 };
  posts.push(post);
  res.status(201).json(post);
});

// GET route
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
