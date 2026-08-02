import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const username = String(body.username || "").trim().toLowerCase().replace(/^@+/, "");
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3–30 lowercase letters, numbers, dots or underscores" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const [userExists, emailExists] = await Promise.all([
      User.exists({ username }),
      User.exists({ email })
    ]);

    if (userExists) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    if (emailExists) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const user = await User.create({
      name,
      username,
      email,
      password: body.password,
      bio: body.bio || "",
      occupation: body.occupation || "",
      college: body.college || "",
      location: body.location || "",
      website: body.website || "",
      interests: Array.isArray(body.interests) ? body.interests : [],
      image: body.image || ""
    });

    return NextResponse.json(
      { message: "User profile created successfully", user: user.getPublicProfile() },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const query = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
            { occupation: { $regex: q, $options: "i" } },
            { college: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(query).select("-password").limit(20).lean();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}
