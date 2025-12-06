import mongoose from "mongoose";
import { BUILDING } from "../buildings.js";

/*
    Post Schema
    - postId: Unique identifier for the post
    - type: Type of post (FreeFood or MealSwipe)
    - title: Title of the post
    - description: Description of the post
    - location: Location details including building code, latitude, and longitude
    - reporter: Reference to the User who created the post
    - createdAt: Timestamp when the post was created
    - expiresAt: Timestamp when the post expires
    - isExpired: Boolean indicating if the post is expired
    - isFlagged: Boolean indicating if the post has been flagged
    - flagCount: Number of times the post has been flagged
*/

const postSchema = new mongoose.Schema({
  postId: { type: Number, unique: true, required: true },
  type: {
    type: String,
    enum: ["FreeFood", "MealSwipe"],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  location: {
    buildingCode: {
      type: String,
      enum: Object.values(BUILDING).map(b => b.id),
      required: true
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  flagCount: { type: Number, default: 0 },
});

export default mongoose.model("Post", postSchema);