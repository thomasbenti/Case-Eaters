import mongoose from "mongoose";

const BUILDING = Object.freeze({
  "Kelvin Smith Library": "KSL",
  "Tinkham Veale University Center": "TVC",
  "Nord Hall": "NOD",
  "Fribley Commons": "FRC",
  "Leutner Commons": "LTC",
});

const locationSchema = new mongoose.Schema({
  buildingCode: {
    type: String,
    enum: Object.values(BUILDING),
    required: true,
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const postSchema = new mongoose.Schema({
  postId: { type: Number, unique: true, required: true },
  type: { type: String, enum: ["FreeFood", "MealSwipe"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: locationSchema, required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  flagCount: { type: Number, default: 0 },
});

export default mongoose.model("Post", postSchema);