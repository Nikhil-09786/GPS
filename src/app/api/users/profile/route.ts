import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { currentUsername, username, bio, image } = await req.json();

    if (!currentUsername) {
      return NextResponse.json({ error: "Current username is required" }, { status: 400 });
    }

    const cleanCurrent = String(currentUsername).trim().toLowerCase().replace(/^@+/, "");
    const userDoc = await User.findOne({ username: cleanCurrent });

    if (!userDoc) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Check if new username is taken by someone else
    if (username && username.trim().toLowerCase() !== cleanCurrent) {
      const cleanNew = username.trim().toLowerCase().replace(/^@+/, "");
      const existing = await User.findOne({ username: cleanNew });
      if (existing) {
        return NextResponse.json({ error: `@${cleanNew} is already taken` }, { status: 409 });
      }
      userDoc.username = cleanNew;
    }

    if (typeof bio === "string") {
      userDoc.bio = bio;
    }

    if (typeof image === "string") {
      userDoc.image = image;
    }

    await userDoc.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: userDoc.name,
        username: userDoc.username,
        email: userDoc.email,
        image: userDoc.image,
        bio: userDoc.bio,
        occupation: userDoc.occupation,
        college: userDoc.college,
        location: userDoc.location
      }
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
