import mongoose from "mongoose";
import bcrypt from "bcryptjs";
/*
    User Schema
    - userId: Unique identifier for the user
    - firstName: User's first name
    - lastName: User's last name
    - email: User's email address (unique)
    - password: Hashed password for authentication
    - mealPlan: Boolean indicating if the user has a meal plan
    - receivesNotifications: Boolean indicating if the user wants to receive notifications
    - isActive: Boolean indicating if the user's account is active
*/
const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, required: true },
  firstName:{ type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: { type: String, required: true },
  mealPlan: { type: Boolean, default: false },
  receivesNotifications: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plaintext password to hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);