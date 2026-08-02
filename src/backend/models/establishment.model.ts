import mongoose from "mongoose";

const { Schema } = mongoose;

const establishmentSchema = new Schema(
  {
    establishmentName: {
      type: String,
      required: [true, "Establishment name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"]
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-z0-9._]+$/, "Username can only contain lowercase letters, numbers, dots and underscores"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      trim: true
    },
    subcategory: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: "Welcome to our place on PlaceBook!",
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    tags: {
      type: [String],
      default: []
    },
    phone: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    location: {
      country: { type: String, default: "India" },
      state: { type: String, default: "Assam" },
      city: { type: String, default: "Silchar" },
      address: { type: String, default: "NIT Silchar Campus" }
    },
    image: {
      type: String,
      default: ""
    },
    coverImage: {
      type: String,
      default: ""
    },
    verified: {
      type: Boolean,
      default: false
    },
    priceRange: {
      type: String,
      enum: ["₹", "₹₹", "₹₹₹", "₹₹₹₹", ""],
      default: "₹"
    },
    amenities: {
      wifi: { type: Boolean, default: true },
      parking: { type: Boolean, default: true },
      accessibility: { type: Boolean, default: true },
      ac: { type: Boolean, default: false },
      delivery: { type: Boolean, default: false }
    },
    capacity: {
      type: Number,
      default: 50
    },

    // Track saved users for toggle Save/Unsave
    savedBy: {
      type: [String],
      default: []
    },

    // PlaceScore engagement metrics
    saves: { type: Number, default: 0 },
    checkIns: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    photoUploads: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 4.0, min: 4.0, max: 9.9 },
    lastActivity: { type: Date, default: Date.now },
    placeScore: { type: Number, default: 100 }
  },
  {
    timestamps: true,
    collection: "establishments"
  }
);

// Prevent model overwrite in Next.js
const Establishment =
  mongoose.models.establishment ||
  mongoose.model("establishment", establishmentSchema);

export default Establishment;
