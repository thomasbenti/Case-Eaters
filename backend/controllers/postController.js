import Post from "../models/Post.js";
import { BUILDING } from "../buildings.js";

// Convert "11:59 PM" to a Date object for today
function parseTimeStringToToday(timeStr) {
  const now = new Date();
  const [time, meridiem] = timeStr.split(" "); // ["11:59", "PM"]
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  // Convert to 24-hour time
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}



// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    console.log("FULL REQUEST BODY:", JSON.stringify(req.body, null, 2));
    
    // console.log("testing!!!!");
    // console.log("BUILDING", BUILDING);
    //console.log("BUILDING_COORDS", BUILDING_COORDS);
    //console.log("incoming code:", req.body.location.buildingCode);

    const { type, title, description, location, expiresAt } = req.body;
    //console.log("location: ", location);

    const expireDate = parseTimeStringToToday(expiresAt);
    const buildingKey = Object.entries(BUILDING).find(
      ([fullName, data]) =>
        data.id === location.buildingCode
    );
    console.log("Building key: ", buildingKey);
    if(!buildingKey){
      return res.status(400).json({ message: "Invalid building code" });
    }

    const lat = buildingKey[1].lat;
    const lng = buildingKey[1].lng;
    console.log("lat: ", lat, " long: ", lng);
    // Generate unique postId
    const lastPost = await Post.findOne().sort({ postId: -1 });
    const postId = lastPost ? lastPost.postId + 1 : 1;
    
    console.log("post information: ");
    console.log(postId);
    console.log(type);
    console.log(title);
    console.log(description);
    console.log(buildingKey[1].id);
    console.log(lat);
    console.log(lng);
    console.log(req.user._id);
    console.log(expiresAt);

    const post = await Post.create({
      postId,
      type,
      title,
      description,
      location: {
        buildingCode: buildingKey[1].id,
        lat: lat,
        lng: lng
      },
      reporter: req.user._id,
      expiresAt: expireDate,
    });
    console.log("marker");

    

    const populatedPost = await Post.findById(post._id).populate("reporter", "firstName lastName email");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all active posts
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  try {
    const { type, location, isExpired } = req.query;
    
    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (location) filter["location.buildingCode"] = location;
    if (isExpired !== undefined) filter.isExpired = isExpired === "true";

    const posts = await Post.find(filter)
      .populate("reporter", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("reporter", "firstName lastName email");
    
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post creator
    if (post.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const { title, description, location, expiresAt, isExpired } = req.body;

    post.title = title || post.title;
    post.description = description || post.description;
    post.location = location || post.location;
    post.expiresAt = expiresAt || post.expiresAt;
    if (isExpired !== undefined) post.isExpired = isExpired;

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate("reporter", "firstName lastName email");
    
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post creator
    if (post.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag a post
// @route   PUT /api/posts/:id/flag
// @access  Private
export const flagPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.flagCount += 1;
    post.isFlagged = true;

    await post.save();
    res.json({ message: "Post flagged", flagCount: post.flagCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark post as expired
// @route   PUT /api/posts/:id/expire
// @access  Private
export const expirePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the post creator
    if (post.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to expire this post" });
    }

    post.isExpired = true;
    await post.save();
    
    res.json({ message: "Post marked as expired" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ reporter: req.params.userId })
      .populate("reporter", "firstName lastName email")
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};