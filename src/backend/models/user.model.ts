import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
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

    // Profile Details
    image: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: ""
    },
    occupation: {
      type: String,
      maxlength: [100, "Occupation cannot exceed 100 characters"],
      default: ""
    },
    college: {
      type: String,
      maxlength: [120, "College/Organization cannot exceed 120 characters"],
      default: ""
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    interests: {
      type: [String],
      default: []
    },

    verified: {
      type: Boolean,
      default: false
    },

    // Connections (Circle count - array of user usernames)
    connections: {
      type: [String],
      default: []
    },

    // Saved Places (SP count - array of establishment usernames)
    savedPlaces: {
      type: [String],
      default: []
    },

    postCount: {
      type: Number,
      default: 0
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);

userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;